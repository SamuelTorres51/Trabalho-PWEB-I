import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url({
    message: "A 'DATABASE_URL' deve ser informada nas variáveis de ambiente!",
  }),
})

export const env = envSchema.parse(process.env)
