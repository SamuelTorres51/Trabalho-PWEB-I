import type { FastifyInstance } from 'fastify'
import { AutenticacaoController } from '../controllers/autenticacao.controller.ts'

export async function autenticacaoRoutes(app: FastifyInstance) {
  const autenticacaoController = new AutenticacaoController(app)

  // Cadastro de novo usuário
  app.post('/cadastro', async (request, reply) => {
    return autenticacaoController.cadastrar(request, reply)
  })

  // Login
  app.post('/login', async (request, reply) => {
    return autenticacaoController.login(request, reply)
  })

  // Verificar token
  app.get('/verificar-token', async (request, reply) => {
    return autenticacaoController.verificarToken(request, reply)
  })
}
