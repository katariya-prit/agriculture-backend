import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: ['https://agriculture-web-inky.vercel.app', 'http://localhost:5173'], // tamaru Vite port match karo
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['cache-control', 'content-language', 'content-type', 'expires', 'pragma'],
  credentials: true,
  maxAge: 90,
})

export default corsConfig