import type { FastifyInstance } from 'fastify'
import { AgendamentosController } from '../controllers/agendamentos.controller.ts'

export async function agendamentosRoutes(app: FastifyInstance) {
  const agendamentosController = new AgendamentosController()

  // Listar todos os agendamentos (apenas admin)
  app.get('/', async (request, reply) => {
    return agendamentosController.listarTodos(request, reply)
  })

  // Listar agendamentos do usuário logado
  app.get('/meus-agendamentos', async (request, reply) => {
    return agendamentosController.listarPorUsuario(request, reply)
  })

  // Buscar agendamento por ID
  app.get('/:id', async (request, reply) => {
    return agendamentosController.buscarPorId(request, reply)
  })

  // Criar novo agendamento
  app.post('/', async (request, reply) => {
    return agendamentosController.criar(request, reply)
  })

  // Atualizar agendamento
  app.put('/:id', async (request, reply) => {
    return agendamentosController.atualizar(request, reply)
  })

  // Cancelar agendamento
  app.patch('/:id/cancelar', async (request, reply) => {
    return agendamentosController.cancelar(request, reply)
  })

  // Deletar agendamento
  app.delete('/:id', async (request, reply) => {
    return agendamentosController.deletar(request, reply)
  })
}
