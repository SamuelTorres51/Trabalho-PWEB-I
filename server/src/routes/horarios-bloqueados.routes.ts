import type { FastifyInstance } from 'fastify'
import { HorariosBloqueadosController } from '../controllers/horarios-bloqueados.controller.ts'

export async function horariosBloqueadosRoutes(app: FastifyInstance) {
  const horariosBloqueadosController = new HorariosBloqueadosController()

  // Listar todos os horários bloqueados
  app.get('/', async (request, reply) => {
    return horariosBloqueadosController.listarTodos(request, reply)
  })

  // Listar horários bloqueados por data
  app.get('/data/:data', async (request, reply) => {
    return horariosBloqueadosController.listarPorData(request, reply)
  })

  // Listar horários bloqueados por barbeiro e data
  app.get('/buscar', async (request, reply) => {
    return horariosBloqueadosController.listarPorBarbeiroEData(request, reply)
  })

  // Buscar horário bloqueado por ID
  app.get('/:id', async (request, reply) => {
    return horariosBloqueadosController.buscarPorId(request, reply)
  })

  // Criar horário bloqueado
  app.post('/', async (request, reply) => {
    return horariosBloqueadosController.criar(request, reply)
  })

  // Deletar horário bloqueado
  app.delete('/:id', async (request, reply) => {
    return horariosBloqueadosController.deletar(request, reply)
  })
}
