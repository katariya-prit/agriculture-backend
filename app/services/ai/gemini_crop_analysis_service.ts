// app/services/ai/gemini_crop_analysis_service.ts
import env from '#start/env'

export type SupportedLanguage = 'gu' | 'hi' | 'en'

const LANGUAGE_LABEL: Record<SupportedLanguage, string> = {
  gu: 'Gujarati',
  hi: 'Hindi',
  en: 'English',
}

// Script name + native example, taki model Latin/romanized transliteration
// (Gujlish/Hinglish) na vapre ane asli native script (Unicode) ma j lakhe.
const SCRIPT_INSTRUCTION: Record<SupportedLanguage, string> = {
  gu: `Gujarati SCRIPT (ગુજરાતી લિપિ) ma j lakhવું. Roman/English letters ma
romanized Gujarati (jem ke "Chhod tandurast chhe") BILKUL na lakhvું. Sachu
udaharan: "છોડ સ્વસ્થ છે". Jawab andar dareek shabda Gujarati script ma j hova joie.`,
  hi: `Hindi SCRIPT (देवनागरी) ma j lakhvu. Roman/English letters ma romanized
Hindi (jem ke "Paudha swasth hai") BILKUL na lakhvu. Sachu udaharan: "पौधा
स्वस्थ है". Jawab andar dareek shabda Devanagari script ma j hova joie.`,
  en: `Plain English ma lakho, standard Latin script vaparo.`,
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

export interface CropAnalysisResult {
  cropName: string
  isHealthy: boolean
  diseaseName: string | null
  confidence: number
  symptoms: string[]
  description: string
  treatment: {
    organic: string[]
    chemical: string[]
    prevention: string[]
  }
  rawText?: string
}

export default class GeminiCropAnalysisService {
  private apiKey = env.get('GEMINI_API_KEY')
  private model = 'gemini-3.5-flash-lite'
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  /**
   * Have local model nathi vaparata - image SEEDHU Gemini vision ne
   * jay chhe, base64 inline data tarike. Fakt ek j API key vapraay chhe.
   */
  async analyzeCropImage(
    imageBuffer: Buffer,
    mimeType: string,
    language: SupportedLanguage = 'gu',
    userNote?: string
  ): Promise<CropAnalysisResult> {
    const base64Image = imageBuffer.toString('base64')
    const languageLabel = LANGUAGE_LABEL[language] ?? 'Gujarati'
    const scriptInstruction = SCRIPT_INSTRUCTION[language] ?? SCRIPT_INSTRUCTION.gu

    const prompt = `
${AGRICULTURE_ONLY_INSTRUCTION}

Tame ek agriculture crop-disease vision expert cho. Niche aapel pan (leaf)/
crop nu image jovo ane analyze karo:

1. Pehla check karo image ma khekhdu chhod/pan chhe ke nahi - jo na hoy to
   isHealthy=true, diseaseName=null, description ma spashta lakho ke aa
   plant/crop nathi lagtu.
2. Pak (crop) nu naam identify karo.
3. Pan healthy chhe ke disease/pest damage dekhay chhe te nakki karo.
4. Disease hoy to naam, lakshano, ane treatment aapo.

${userNote ? `Khedut e aa note lakhyu chhe: "${userNote}"` : ''}

MAHATVANU: Tamaru AAKHU jawab (JSON values andar nu text) ${languageLabel}
bhasha ma j hovu joie. Fakt JSON key names English rakho.

${scriptInstruction}

Jawab FAKT niche STRICT JSON format ma j aapo, koi extra text, koi markdown
backticks nahi:

{
  "cropName": "pak nu naam",
  "isHealthy": true/false,
  "diseaseName": "bimari nu naam athva null",
  "confidence": 0-100 vachhe ek number (tamari vision-based estimate),
  "symptoms": ["lakshano ni list"],
  "description": "clear ane practical varnan",
  "treatment": {
    "organic": ["organic/desi upay"],
    "chemical": ["chemical dawa"],
    "prevention": ["bhavishya na bachav na pagla"]
  }
}
`.trim()

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { inline_data: { mime_type: mimeType, data: base64Image } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
    }

    const data = await this.callGemini(requestBody)
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error('Gemini thi koi response nathi malyu (empty candidates)')

    try {
      return JSON.parse(rawText) as CropAnalysisResult
    } catch {
      return {
        cropName: 'Spashta nathi',
        isHealthy: true,
        diseaseName: null,
        confidence: 0,
        symptoms: [],
        description: rawText,
        treatment: { organic: [], chemical: [], prevention: [] },
        rawText,
      }
    }
  }

  async chatReply(
    message: string,
    history: { role: string; text: string }[] = [],
    language: SupportedLanguage = 'gu'
  ): Promise<string> {
    const languageLabel = LANGUAGE_LABEL[language] ?? 'Gujarati'
    const scriptInstruction = SCRIPT_INSTRUCTION[language] ?? SCRIPT_INSTRUCTION.gu
    const languageInstruction = `${AGRICULTURE_ONLY_INSTRUCTION}\n\n${ASSISTANT_CAPABILITIES}\n\nTamaru jawab ${languageLabel} bhasha ma j aapo.\n${scriptInstruction}`

    const contents = [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: `${languageInstruction}\n\nProshn: ${message}` }] },
    ]

    const data = await this.callGemini({ contents, generationConfig: { temperature: 0.4 } })
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error('Gemini thi koi response nathi malyu')
    return rawText
  }

  private async callGemini(body: unknown): Promise<GeminiResponse> {
    const res = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API error (${res.status}): ${errText}`)
    }
    return res.json() as Promise<GeminiResponse>
  }
}

const AGRICULTURE_ONLY_INSTRUCTION = `Tame FAKT khedut/agriculture-related sawalo j jawab aapo. Bija koi topic (politics, entertainment, coding, general knowledge) na jawab aapva nahi - vinamrata thi na kaho ke tame fakt agriculture assistant cho.`

// UI ni "Detailed Explanation" card ma je capabilities batavya chhe, te j
// tame khedut ne pramanik rite dekhado - jyare relevant hoy tyare aa
// features suggest/mention karo.
const ASSISTANT_CAPABILITIES = `Tamari khaasiyat (capabilities) aa chhe, ane relevant hoy tyare khedut ne aa rite j madad karo:
- Mati (soil) ane havaman (weather) na aadhare best pak (crop) sujhavo.
- Khedut ne kyare pani apvu ane kayu khatar (fertilizer) vaparvu te jaanavo.
- Pak na rogo (crop diseases) vahela j detect karo ane treatment sujhavo.
- Transport cost pachi kayu market sauthi saru bhaav aape chhe te batavo.
- Khedut ne seedhu buyer sathe vechva madad karo - koi vachetiya (middleman) ni jarur nathi.`