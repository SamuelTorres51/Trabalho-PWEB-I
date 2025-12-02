import type { FastifyInstance } from 'fastify'
import { UsuariosController } from '../controllers/usuarios.controller.ts'

export async function usuariosRoutes(app: FastifyInstance) {
  const usuariosController = new UsuariosController()

  // Buscar perfil do usuário logado
  app.get('/perfil', async (request, reply) => {
    return usuariosController.buscarPerfil(request, reply)
  })

  // Atualizar perfil do usuário logado
  app.put('/perfil', async (request, reply) => {
    return usuariosController.atualizar(request, reply)
  })

  // Deletar conta do usuário logado
  app.delete('/perfil', async (request, reply) => {
    return usuariosController.deletar(request, reply)
  })
}
