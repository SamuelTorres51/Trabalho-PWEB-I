import { db } from './index.ts'

/**
 * Seed do banco de dados
 *
 * Nota: Os dados de barbeiros e serviços são fixos no frontend e não precisam
 * estar no banco de dados. Os agendamentos salvam apenas os nomes dos barbeiros
 * e serviços como texto.
 *
 * Se precisar adicionar dados iniciais no futuro (como usuários de teste),
 * adicione aqui.
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...')
    console.log('ℹ️  Nenhum dado inicial necessário no momento.')
    console.log('✅ Seed concluído com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error)
    process.exit(1)
  }
}

seed()
