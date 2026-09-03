import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import Agripluse100 from '#models/agripluse_1_0_0'
import AgripluseMap100 from '#models/agripluse_map_1_0_0'

const PYTHON_API_BASE = 'http://127.0.0.1:8000'

// Shape returned by ai_server plant_analysis.py -> predict_plant()
interface PlantPrediction {
    is_plant: boolean
    disease: string | null
    confidence: number
    message: string | null
    raw_probs: Record<string, number>
}

interface PythonResponse {
    success?: boolean
    message?: string
    error?: string

    model?: string
    language?: string
    response?: string
    type?: string

    prediction?: PlantPrediction

    data?: unknown

    nodes?: unknown
    edges?: unknown

    [key: string]: unknown
}

const ALLOWED_LANGUAGES = [
    'english',
    'hindi',
    'gujarati',
]

export default class AisController {
    async chat({ request, response }: HttpContext) {
        try {
            const message = String(
                request.input('message', '')
            )

            const language = String(
                request.input('language', 'english')
            )
                .trim()
                .toLowerCase()

            if (!ALLOWED_LANGUAGES.includes(language)) {
                return response.badRequest({
                    success: false,
                    message: 'Language must be English, Hindi or Gujarati.',
                })
            }

            const image = request.file('image', {
                size: '20mb',
                extnames: [
                    'jpg',
                    'jpeg',
                    'png',
                    'webp',
                ],
            })

            if (image?.hasErrors) {
                return response.badRequest({
                    success: false,
                    message:
                        image.errors[0]?.message ||
                        'Invalid image.',
                })
            }

            const formData = new FormData()

            formData.append(
                'message',
                message
            )

            formData.append(
                'language',
                language
            )

            if (
                image &&
                image.tmpPath
            ) {
                const buffer =
                    await fs.readFile(
                        image.tmpPath
                    )

                const blob =
                    new Blob(
                        [
                            new Uint8Array(buffer),
                        ],
                        {
                            type:
                                image.headers[
                                'content-type'
                                ] ||
                                'image/jpeg',
                        }
                    )

                formData.append(
                    'image',
                    blob,
                    image.clientName
                )
            }

            console.log(
                '➡️ Sending request to Python AI:',
                {
                    message,
                    language,
                    hasImage: !!image,
                }
            )

            const aiResponse =
                await fetch(
                    `${PYTHON_API_BASE}/chat`,
                    {
                        method: 'POST',
                        body: formData,
                        signal:
                            AbortSignal.timeout(
                                120000
                            ),
                    }
                )

            if (
                !aiResponse.ok ||
                !aiResponse.body
            ) {
                const rawText =
                    await aiResponse.text()

                console.error(
                    '❌ Python Chat Error:',
                    rawText
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            'Python AI server error.',
                        error:
                            rawText,
                    })
            }

            // CORS headers are handled globally by the cors middleware now —
            // only stream-transport headers belong here.
            response.header(
                'Content-Type',
                'text/event-stream; charset=utf-8'
            )

            response.header(
                'Cache-Control',
                'no-cache, no-transform'
            )

            response.header(
                'Connection',
                'keep-alive'
            )

            response.header(
                'X-Accel-Buffering',
                'no'
            )

            try {
                response.response.flushHeaders?.()
            } catch { }

            const reader =
                aiResponse.body.getReader()

            const decoder =
                new TextDecoder()

            // Chat responses stream through as-is (both the "not a plant"
            // rejection stream and the normal Ollama stream use the same
            // event-stream format from main.py), so no parsing needed here.
            // We still sniff the final "done" event so we can log/persist
            // the prediction, same as before but with the new field names.
            let completeStream = ''

            while (true) {
                const {
                    done,
                    value,
                } = await reader.read()

                if (done) {
                    break
                }

                const chunk =
                    decoder.decode(
                        value,
                        {
                            stream: true,
                        }
                    )

                if (chunk) {
                    completeStream += chunk
                    response.response.write(
                        chunk
                    )
                }
            }

            const remaining =
                decoder.decode()

            if (remaining) {
                completeStream += remaining
                response.response.write(
                    remaining
                )
            }

            response.response.end()

            try {
                const lines = completeStream.split('\n')
                let donePayload: { prediction?: PlantPrediction } | null = null

                for (const rawLine of lines) {
                    const line = rawLine.trim()
                    if (!line.startsWith('data:')) continue

                    const jsonText = line.replace(/^data:\s*/, '').trim()
                    if (!jsonText) continue

                    try {
                        const parsed = JSON.parse(jsonText)
                        if (parsed.type === 'done') {
                            donePayload = parsed
                        }
                    } catch { }
                }

                if (donePayload?.prediction) {
                    const p = donePayload.prediction

                    await Agripluse100.create({
                        userId: null,
                        message: message || null,
                        language,
                        imagePath: null,
                        isPlant: p.is_plant,
                        disease: p.disease,
                        confidence: p.confidence,
                        aiMessage: p.message,
                        rawProbs: p.raw_probs,
                        aiResponse: completeStream,
                    })

                    console.log('💾 Chat prediction saved.')
                }
            } catch (saveError) {
                console.error('❌ Chat prediction save error:', saveError)
            }

            console.log(
                '✅ Python AI stream completed.'
            )
        } catch (error) {
            console.error(
                '❌ AI CHAT ERROR:',
                error
            )

            if (
                !response.response.headersSent
            ) {
                return response
                    .status(500)
                    .send({
                        success: false,
                        message:
                            'Python AI server sathe connect thai shakyu nahi.',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    })
            }

            try {
                response.response.write(
                    `event: error\n` +
                    `data: ${JSON.stringify({
                        success: false,
                        message:
                            'AI response failed.',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    })}\n\n`
                )

                response.response.end()
            } catch { }
        }
    }

    async predict({ request, response }: HttpContext) {
        try {
            const image =
                request.file('image', {
                    size: '20mb',
                    extnames: [
                        'jpg',
                        'jpeg',
                        'png',
                        'webp',
                    ],
                })

            if (!image) {
                return response.badRequest({
                    success: false,
                    message:
                        'Plant image required.',
                })
            }

            if (image.hasErrors) {
                return response.badRequest({
                    success: false,
                    message:
                        image.errors[0]?.message ||
                        'Invalid image.',
                })
            }

            if (!image.tmpPath) {
                return response.badRequest({
                    success: false,
                    message:
                        'Uploaded image could not be processed.',
                })
            }

            const buffer =
                await fs.readFile(
                    image.tmpPath
                )

            const formData =
                new FormData()

            const blob =
                new Blob(
                    [
                        new Uint8Array(
                            buffer
                        ),
                    ],
                    {
                        type:
                            image.headers[
                            'content-type'
                            ] ||
                            'image/jpeg',
                    }
                )

            formData.append(
                'image',
                blob,
                image.clientName
            )

            const extension =
                path.extname(
                    image.clientName
                ) || '.jpg'

            const fileName =
                `${randomUUID()}${extension}`

            const uploadDirectory =
                path.join(
                    process.cwd(),
                    'public',
                    'uploads',
                    'plant-analysis'
                )

            await fs.mkdir(
                uploadDirectory,
                {
                    recursive: true,
                }
            )

            const savedFilePath =
                path.join(
                    uploadDirectory,
                    fileName
                )

            await fs.writeFile(
                savedFilePath,
                buffer
            )

            const imagePath =
                `/uploads/plant-analysis/${fileName}`

            console.log(
                '➡️ Sending plant image to Python prediction server...'
            )

            const aiResponse =
                await fetch(
                    `${PYTHON_API_BASE}/predict`,
                    {
                        method: 'POST',
                        body: formData,
                        signal:
                            AbortSignal.timeout(
                                120000
                            ),
                    }
                )

            const rawText =
                await aiResponse.text()

            let data: PythonResponse

            try {
                data =
                    JSON.parse(
                        rawText
                    ) as PythonResponse
            } catch {
                console.error(
                    '❌ Python prediction invalid JSON:',
                    rawText
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            'Python prediction server returned invalid response.',
                        error:
                            rawText,
                    })
            }

            if (
                !aiResponse.ok ||
                data.success === false
            ) {
                console.error(
                    '❌ Python Prediction Error:',
                    data
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            data.message ||
                            'Python plant prediction failed.',
                        error:
                            data.error,
                    })
            }

            // ---------------------------------------------------------
            // NEW: main.py /predict returns { success, model, prediction }
            // where prediction = { is_plant, disease, confidence, message, raw_probs }
            // ---------------------------------------------------------
            const prediction = data.prediction ?? null

            if (!prediction) {
                console.error('❌ Python response missing "prediction" field:', data)

                return response.status(502).send({
                    success: false,
                    message: 'Python prediction server returned an unexpected shape.',
                })
            }

            const savedPrediction =
                await Agripluse100.create({
                    userId: null,
                    message: null,
                    language: 'english',
                    imagePath,
                    isPlant: prediction.is_plant,
                    disease: prediction.disease,
                    confidence: prediction.confidence,
                    aiMessage: prediction.message,
                    rawProbs: prediction.raw_probs,
                    aiResponse: prediction.message,
                })

            console.log(
                '💾 Plant analysis saved:',
                savedPrediction.id
            )

            console.log(
                '✅ Plant Prediction:',
                data
            )

            return response.ok({
                success: true,
                model: data.model,
                isPlant: prediction.is_plant,
                disease: prediction.disease,
                confidence: prediction.confidence,
                message: prediction.message,
                rawProbs: prediction.raw_probs,
                imagePath,
                databaseId: savedPrediction.id,
            })
        } catch (error) {
            console.error(
                '❌ AI PREDICT ERROR:',
                error
            )

            return response
                .status(500)
                .send({
                    success: false,
                    message:
                        'Prediction server sathe connection thai shakyu nahi.',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                })
        }
    }

    async mindmap({ request, response }: HttpContext) {
        try {
            const topic =
                request.input(
                    'topic',
                    ''
                )

            const language =
                request.input(
                    'language',
                    'english'
                )

            if (
                typeof topic !== 'string' ||
                !topic.trim()
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Topic is required.',
                })
            }

            const cleanTopic =
                topic.trim()

            if (
                cleanTopic.length > 500
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Topic cannot exceed 500 characters.',
                })
            }

            const cleanLanguage =
                String(language)
                    .trim()
                    .toLowerCase()

            if (
                !ALLOWED_LANGUAGES.includes(
                    cleanLanguage
                )
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Language must be English, Hindi or Gujarati.',
                })
            }

            const formData =
                new FormData()

            formData.append(
                'topic',
                cleanTopic
            )

            formData.append(
                'language',
                cleanLanguage
            )

            console.log(
                '➡️ Sending MindMap request to Python:',
                {
                    topic: cleanTopic,
                    language: cleanLanguage,
                }
            )

            const aiResponse =
                await fetch(
                    `${PYTHON_API_BASE}/mindmap`,
                    {
                        method: 'POST',
                        body: formData,
                        signal:
                            AbortSignal.timeout(
                                120000
                            ),
                    }
                )

            const rawText =
                await aiResponse.text()

            let data: PythonResponse

            try {
                data =
                    JSON.parse(
                        rawText
                    ) as PythonResponse
            } catch {
                console.error(
                    '❌ Python MindMap invalid JSON:',
                    rawText
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            'Python MindMap server returned invalid response.',
                        error:
                            rawText,
                    })
            }

            if (
                !aiResponse.ok ||
                data.success === false
            ) {
                console.error(
                    '❌ Python MindMap Error:',
                    data
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            data.message ||
                            'AI server failed to generate mind map.',
                        error:
                            data.error,
                    })
            }

            const mindmapData =
                data.data &&
                    typeof data.data === 'object'
                    ? data.data as Record<string, unknown>
                    : {
                        nodes:
                            data.nodes ?? null,
                        edges:
                            data.edges ?? null,
                    }

            const aiResponseText =
                typeof data.response === 'string'
                    ? data.response
                    : typeof data.message === 'string'
                        ? data.message
                        : null

            const savedMap =
                await AgripluseMap100.create({
                    userId: null,
                    topic: cleanTopic,
                    language: cleanLanguage,
                    mindmapData,
                    aiResponse:
                        aiResponseText,
                })

            console.log(
                '💾 MindMap saved:',
                savedMap.id
            )

            console.log(
                '✅ MindMap Response:',
                data
            )

            return response.ok({
                ...data,
                databaseId:
                    savedMap.id,
            })
        } catch (error) {
            console.error(
                '❌ MINDMAP ERROR:',
                error
            )

            return response
                .status(500)
                .send({
                    success: false,
                    message:
                        'Could not connect to Python AI server.',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                })
        }
    }

    async mindmapStream({
        request,
        response,
    }: HttpContext) {
        try {
            const topic =
                request.input(
                    'topic',
                    ''
                )

            const language =
                request.input(
                    'language',
                    'english'
                )

            if (
                typeof topic !== 'string' ||
                !topic.trim()
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Topic is required.',
                })
            }

            const cleanTopic =
                topic.trim()

            if (
                cleanTopic.length > 500
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Topic cannot exceed 500 characters.',
                })
            }

            const cleanLanguage =
                String(language)
                    .trim()
                    .toLowerCase()

            if (
                !ALLOWED_LANGUAGES.includes(
                    cleanLanguage
                )
            ) {
                return response.badRequest({
                    success: false,
                    message:
                        'Language must be English, Hindi or Gujarati.',
                })
            }

            const formData =
                new FormData()

            formData.append(
                'topic',
                cleanTopic
            )

            formData.append(
                'language',
                cleanLanguage
            )

            console.log(
                '➡️ Starting MindMap stream:',
                {
                    topic: cleanTopic,
                    language: cleanLanguage,
                }
            )

            const aiResponse =
                await fetch(
                    `${PYTHON_API_BASE}/mindmap/stream`,
                    {
                        method: 'POST',
                        body: formData,
                        signal:
                            AbortSignal.timeout(
                                120000
                            ),
                    }
                )

            if (
                !aiResponse.ok ||
                !aiResponse.body
            ) {
                const rawText =
                    await aiResponse.text()

                console.error(
                    '❌ Python MindMap Stream Error:',
                    rawText
                )

                return response
                    .status(502)
                    .send({
                        success: false,
                        message:
                            'Python MindMap streaming server failed.',
                        error:
                            rawText,
                    })
            }

            // CORS headers are handled globally by the cors middleware now —
            // only stream-transport headers belong here.
            response.header(
                'Content-Type',
                'text/event-stream; charset=utf-8'
            )

            response.header(
                'Cache-Control',
                'no-cache, no-transform'
            )

            response.header(
                'Connection',
                'keep-alive'
            )

            response.header(
                'X-Accel-Buffering',
                'no'
            )

            try {
                response.response.flushHeaders?.()
            } catch { }

            const reader =
                aiResponse.body.getReader()

            const decoder =
                new TextDecoder()

            let completeStream = ''

            while (true) {
                const {
                    done,
                    value,
                } =
                    await reader.read()

                if (done) {
                    break
                }

                const chunk =
                    decoder.decode(
                        value,
                        {
                            stream: true,
                        }
                    )

                if (chunk) {
                    completeStream += chunk

                    response.response.write(
                        chunk
                    )
                }
            }

            const remaining =
                decoder.decode()

            if (remaining) {
                completeStream += remaining

                response.response.write(
                    remaining
                )
            }

            try {
                let parsedMap:
                    Record<string, unknown> | null = null

                const lines =
                    completeStream.split('\n')

                for (
                    let i = 0;
                    i < lines.length;
                    i++
                ) {
                    const line =
                        lines[i].trim()

                    if (
                        line.startsWith(
                            'data:'
                        )
                    ) {
                        const jsonText =
                            line
                                .replace(
                                    /^data:\s*/,
                                    ''
                                )
                                .trim()

                        if (!jsonText) {
                            continue
                        }

                        try {
                            const parsed =
                                JSON.parse(
                                    jsonText
                                ) as Record<string, unknown>

                            if (
                                parsed.nodes ||
                                parsed.edges ||
                                parsed.data
                            ) {
                                parsedMap =
                                    parsed
                            }
                        } catch { }
                    }
                }

                await AgripluseMap100.create({
                    userId: null,
                    topic: cleanTopic,
                    language: cleanLanguage,
                    mindmapData:
                        parsedMap || {
                            stream:
                                completeStream,
                        },
                    aiResponse:
                        completeStream,
                })

                console.log(
                    '💾 MindMap stream saved to database.'
                )
            } catch (databaseError) {
                console.error(
                    '❌ MindMap database save error:',
                    databaseError
                )
            }

            response.response.end()

            console.log(
                '✅ MindMap stream completed.'
            )
        } catch (error) {
            console.error(
                '❌ MINDMAP STREAM ERROR:',
                error
            )

            if (
                !response.response.headersSent
            ) {
                return response
                    .status(500)
                    .send({
                        success: false,
                        message:
                            'Could not connect to Python MindMap server.',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    })
            }

            try {
                const errorEvent =
                    JSON.stringify({
                        success: false,
                        message:
                            'Mind map generation failed.',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    })

                response.response.write(
                    `event: error\n` +
                    `data: ${errorEvent}\n\n`
                )
            } catch { }

            try {
                response.response.end()
            } catch { }
        }
    }
}