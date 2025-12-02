import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { usuarios } from '../db/schema/index.ts'
import type { FastifyInstance } from 'fastify'

interface CadastroInput {
  nomeCompleto: string
  email: string
  telefone: string
  senha: string
  dataNascimento: string
}

interface LoginInput {
  email: string
  senha: string
}

export class AutenticacaoService {
  constructor(private app: FastifyInstance) {}

  async cadastrar(dados: CadastroInput) {
    // Verifica se o email já existe
    const usuarioExistente = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, dados.email))
      .limit(1)

    if (usuarioExistente.length > 0) {
      throw new Error('Email já cadastrado')
    }

    // Em produção, usar bcrypt para hash da senha
    // const senhaHash = await bcrypt.hash(dados.senha, 10)

    // Por enquanto, vou deixar sem hash (APENAS PARA DESENVOLVIMENTO)
    const [novoUsuario] = await db
      .insert(usuarios)
      .values({
        nomeCompleto: dados.nomeCompleto,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha, // TROCAR para senhaHash em produção
        dataNascimento: dados.dataNascimento,
      })
      .returning()

    // Gera token JWT
    const token = this.app.jwt.sign(
      {
        id: novoUsuario.id,
        email: novoUsuario.email,
        nome: novoUsuario.nomeCompleto,
      },
      {
        expiresIn: '7d',
      },
    )

    return {
      usuario: {
        id: novoUsuario.id,
        nomeCompleto: novoUsuario.nomeCompleto,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
      },
      token,
    }
  }

  async login(dados: LoginInput) {
    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, dados.email))
      .limit(1)

    if (!usuario) {
      throw new Error('Email ou senha inválidos')
    }

    // Em produção, usar bcrypt.compare
    // const senhaValida = await bcrypt.compare(dados.senha, usuario.senha)
    const senhaValida = dados.senha === usuario.senha // APENAS PARA DESENVOLVIMENTO

    if (!senhaValida) {
      throw new Error('Email ou senha inválidos')
    }

    // Gera token JWT
    const token = this.app.jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nomeCompleto,
      },
      {
        expiresIn: '7d',
      },
    )

    return {
      usuario: {
        id: usuario.id,
        nomeCompleto: usuario.nomeCompleto,
        email: usuario.email,
        telefone: usuario.telefone,
      },
      token,
    }
  }

  async verificarToken(token: string) {
    try {
      const decoded = this.app.jwt.verify(token)
      return decoded
    } catch (error) {
      throw new Error('Token inválido ou expirado')
    }
  }
}
