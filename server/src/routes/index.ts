import type { FastifyInstance } from 'fastify'
import { autenticacaoRoutes } from './autenticacao.routes.ts'
import { usuariosRoutes } from './usuarios.routes.ts'
import { agendamentosRoutes } from './agendamentos.routes.ts'
import { horariosBloqueadosRoutes } from './horarios-bloqueados.routes.ts'

export async function registrarRotas(app: FastifyInstance) {
  // Rotas de autenticação (não precisam de /api)
  app.register(autenticacaoRoutes, { prefix: '/auth' })

  // Rotas da API
  app.register(usuariosRoutes, { prefix: '/api/usuarios' })
  app.register(agendamentosRoutes, { prefix: '/api/agendamentos' })
  app.register(horariosBloqueadosRoutes, {
    prefix: '/api/horarios-bloqueados',
  })
}
