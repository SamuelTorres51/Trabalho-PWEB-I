# 🎯 Barbearia Style - Sistema de Agendamento Online

Sistema web completo para gerenciamento de agendamentos de uma barbearia, desenvolvido como trabalho acadêmico para a disciplina de Programação Web I. A aplicação permite que clientes visualizem serviços, barbeiros, realizem agendamentos online e gerenciem seu perfil de forma intuitiva e moderna.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Funciona](#como-funciona)
- [Instalação e Execução](#instalação-e-execução)
- [API Endpoints](#api-endpoints)
- [Banco de Dados](#banco-de-dados)

---

## 🎯 Visão Geral

O **Barbearia Style** é uma aplicação web full-stack que oferece uma solução completa para gerenciamento de agendamentos de uma barbearia. O sistema foi desenvolvido seguindo as melhores práticas de desenvolvimento web, com separação clara entre front-end e back-end, utilizando uma arquitetura em camadas (MVC) e padrões RESTful para a API.

### Objetivos do Projeto

- ✅ Permitir que clientes visualizem serviços e barbeiros disponíveis
- ✅ Facilitar o agendamento de horários de forma online e intuitiva
- ✅ Gerenciar perfil do usuário e histórico de agendamentos
- ✅ Implementar sistema de autenticação seguro com JWT
- ✅ Controlar horários bloqueados e disponibilidade de barbeiros
- ✅ Oferecer interface responsiva e moderna

---

## 🏗️ Arquitetura do Sistema

O sistema foi desenvolvido seguindo uma **arquitetura em camadas (Layered Architecture)** com separação clara de responsabilidades entre front-end e back-end.

### Diagrama de Arquitetura Geral

```mermaid
graph TB
    subgraph "Cliente (Front-end)"
        A[HTML/CSS/JavaScript]
        B[API Client]
        C[LocalStorage]
    end
    
    subgraph "Servidor (Back-end)"
        D[Fastify Server]
        E[Routes Layer]
        F[Controllers Layer]
        G[Services Layer]
        H[Database Layer]
    end
    
    subgraph "Banco de Dados"
        I[(PostgreSQL)]
    end
    
    A --> B
    B --> C
    B -->|HTTP/REST| D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> H
    H --> G
    G --> F
    F --> E
    E --> D
    D -->|JSON| B
    B --> A
```

### Arquitetura em Camadas (Back-end)

```mermaid
graph LR
    subgraph "Camada de Apresentação"
        A[Routes]
    end
    
    subgraph "Camada de Controle"
        B[Controllers]
    end
    
    subgraph "Camada de Negócio"
        C[Services]
    end
    
    subgraph "Camada de Dados"
        D[Database Schema]
        E[Drizzle ORM]
    end
    
    A -->|Validação| B
    B -->|Lógica de Negócio| C
    C -->|Queries| E
    E -->|SQL| D
    D -->|Resultados| E
    E -->|Dados| C
    C -->|Resposta| B
    B -->|JSON| A
```

### Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Front-end
    participant API as Back-end API
    participant DB as Banco de Dados
    
    C->>F: Preenche formulário de login
    F->>API: POST /auth/login
    API->>DB: Verifica credenciais
    DB-->>API: Dados do usuário
    API->>API: Gera JWT Token
    API-->>F: Token + Dados do usuário
    F->>F: Armazena no localStorage
    F->>C: Redireciona para home
    
    Note over F: Próximas requisições
    F->>API: GET /api/usuarios/perfil<br/>Header: Authorization: Bearer {token}
    API->>API: Valida JWT Token
    API->>DB: Busca dados do usuário
    DB-->>API: Dados do usuário
    API-->>F: Dados do perfil
```

### Fluxo de Agendamento

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Front-end
    participant API as Back-end API
    participant DB as Banco de Dados
    
    C->>F: Seleciona data, horário, serviço e barbeiro
    F->>API: GET /api/horarios-bloqueados/buscar<br/>?nomeBarbeiro=X&data=Y
    API->>DB: Consulta horários bloqueados
    DB-->>API: Lista de horários bloqueados
    API-->>F: Horários disponíveis
    
    F->>F: Valida disponibilidade no front-end
    
    C->>F: Confirma agendamento
    F->>API: POST /api/agendamentos<br/>Header: Authorization: Bearer {token}
    API->>API: Valida JWT Token
    API->>DB: Verifica se usuário existe
    DB-->>API: Usuário válido
    API->>DB: Cria agendamento
    API->>DB: Cria horário bloqueado
    DB-->>API: Agendamento criado
    API-->>F: Confirmação do agendamento
    F->>C: Exibe mensagem de sucesso
```

### Modelo de Dados (ER)

```mermaid
erDiagram
    USUARIOS ||--o{ AGENDAMENTOS : possui
    AGENDAMENTOS }o--|| HORARIOS_BLOQUEADOS : gera
    
    USUARIOS {
        uuid id PK
        text nome_completo
        text email UK
        text telefone
        text senha
        date data_nascimento
        text observacoes
        timestamp criado_em
        timestamp atualizado_em
    }
    
    AGENDAMENTOS {
        uuid id PK
        uuid usuario_id FK
        text nome_barbeiro
        text nome_servico
        date data
        time horario
        text status
        text observacoes
        timestamp criado_em
        timestamp atualizado_em
    }
    
    HORARIOS_BLOQUEADOS {
        uuid id PK
        text nome_barbeiro
        date data
        time horario
        text motivo
        timestamp criado_em
        timestamp atualizado_em
    }
```

---

## 🛠️ Tecnologias Utilizadas

### Front-end

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **HTML5** | - | Estruturação das páginas |
| **CSS3** | - | Estilização e responsividade |
| **JavaScript (ES6+)** | - | Interatividade e consumo da API |
| **Font Awesome** | 6.0.0 | Ícones e elementos visuais |
| **Fetch API** | Nativo | Comunicação com o back-end |
| **LocalStorage** | Nativo | Armazenamento de token e dados do usuário |

### Back-end

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.9.3 | Linguagem de programação |
| **Fastify** | 5.6.2 | Framework web rápido e eficiente |
| **Drizzle ORM** | 0.44.7 | ORM para PostgreSQL |
| **PostgreSQL** | 18 | Banco de dados relacional |
| **Zod** | 4.1.13 | Validação de schemas |
| **JWT** | 10.0.0 | Autenticação baseada em tokens |
| **CORS** | 11.1.0 | Controle de acesso cross-origin |

### Ferramentas de Desenvolvimento

| Ferramenta | Versão | Uso |
|------------|--------|-----|
| **Drizzle Kit** | 0.31.7 | Migrações e gerenciamento do banco |
| **TSX** | 4.21.0 | Execução de TypeScript |
| **Biome** | 2.3.8 | Linter e formatador de código |
| **Docker** | - | Containerização do PostgreSQL |
| **Docker Compose** | - | Orquestração de containers |

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação e Autorização

- ✅ **Cadastro de Usuários**
  - Validação de dados com Zod
  - Hash de senhas (preparado para bcrypt)
  - Verificação de email único
  - Armazenamento seguro de dados pessoais

- ✅ **Login e Logout**
  - Autenticação via email e senha
  - Geração de JWT tokens com expiração de 7 dias
  - Armazenamento seguro do token no localStorage
  - Verificação automática de token em requisições protegidas

- ✅ **Proteção de Rotas**
  - Middleware de autenticação JWT
  - Redirecionamento automático para login quando não autenticado
  - Guard de rotas no front-end (auth-guard.js)

### 👤 Gerenciamento de Perfil

- ✅ **Visualização de Perfil**
  - Exibição de dados pessoais do usuário
  - Histórico de agendamentos
  - Informações de contato

- ✅ **Edição de Perfil**
  - Atualização de dados pessoais
  - Validação de campos
  - Persistência no banco de dados

### 📅 Sistema de Agendamentos

- ✅ **Visualização de Serviços**
  - Listagem de serviços disponíveis
  - Detalhes de cada serviço (preço, duração, descrição)
  - Modal com informações completas

- ✅ **Visualização de Barbeiros**
  - Cards com informações dos barbeiros
  - Especialidades e avaliações
  - Seleção de barbeiro para agendamento

- ✅ **Criação de Agendamentos**
  - Seleção de data através de calendário interativo
  - Seleção de horário disponível
  - Escolha de serviço e barbeiro
  - Campo de observações opcional
  - Validação de disponibilidade

- ✅ **Gerenciamento de Agendamentos**
  - Listagem de agendamentos do usuário
  - Cancelamento de agendamentos
  - Atualização de status (pendente, confirmado, concluído, cancelado)

- ✅ **Controle de Horários Bloqueados**
  - Bloqueio automático ao criar agendamento
  - Desbloqueio ao cancelar agendamento
  - Consulta de horários disponíveis por barbeiro e data
  - Prevenção de conflitos de horário

### 🧮 Calculadora de Preços

- ✅ **Cálculo Dinâmico**
  - Seleção múltipla de serviços
  - Cálculo automático de subtotal
  - Aplicação de descontos para pacotes
  - Exibição de total final

### 🎨 Interface do Usuário

- ✅ **Design Responsivo**
  - Layout adaptável para desktop, tablet e mobile
  - Menu hambúrguer para dispositivos móveis
  - Grid system flexível

- ✅ **Tema Claro/Escuro**
  - Alternância entre temas
  - Persistência da preferência no localStorage
  - Transições suaves

- ✅ **Animações e Interatividade**
  - Animações de scroll
  - Modais e popups
  - Feedback visual em ações do usuário
  - Carrossel de imagens no hero

- ✅ **Acessibilidade**
  - Navegação por teclado
  - Labels descritivos
  - Contraste adequado
  - Ícones com aria-labels

### 📱 Funcionalidades Extras

- ✅ **Saudação Dinâmica**
  - Mensagem personalizada baseada no horário do dia
  - Exibição do nome do usuário logado

- ✅ **Integração WhatsApp**
  - Botão flutuante para contato direto
  - Link pré-formatado com mensagem

- ✅ **Navegação Suave**
  - Scroll suave entre seções
  - Links âncora funcionais
  - Menu de navegação fixo

---

## 📁 Estrutura do Projeto

```
Trabalho-PWEB-I/
│
├── 📂 index/                    # Páginas HTML
│   ├── home.html               # Página principal (serviços, barbeiros, agendamento)
│   ├── login.html              # Página de login e cadastro
│   └── profile.html            # Página de perfil do usuário
│
├── 📂 script/                   # Scripts JavaScript
│   ├── api.js                  # Cliente API (comunicação com back-end)
│   ├── auth-guard.js           # Proteção de rotas no front-end
│   ├── home.js                 # Lógica da página home
│   ├── login.js                # Lógica da página de login
│   ├── profile.js              # Lógica da página de perfil
│   └── theme.js                # Gerenciamento de tema claro/escuro
│
├── 📂 style/                    # Arquivos CSS
│   ├── common.css              # Estilos comuns a todas as páginas
│   ├── home.css                # Estilos específicos da home
│   ├── login.css               # Estilos específicos do login
│   └── profile.css             # Estilos específicos do perfil
│
├── 📂 img/                      # Imagens e assets
│   ├── favicon-96x96.png
│   └── pic1.jpg até pic5.jpg
│
├── 📂 server/                   # Back-end (API)
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Camada de controle
│   │   │   ├── autenticacao.controller.ts
│   │   │   ├── usuarios.controller.ts
│   │   │   ├── agendamentos.controller.ts
│   │   │   └── horarios-bloqueados.controller.ts
│   │   │
│   │   ├── 📂 services/        # Camada de negócio
│   │   │   ├── autenticacao.service.ts
│   │   │   ├── usuarios.service.ts
│   │   │   ├── agendamentos.service.ts
│   │   │   └── horarios-bloqueados.service.ts
│   │   │
│   │   ├── 📂 routes/          # Camada de rotas
│   │   │   ├── index.ts
│   │   │   ├── autenticacao.routes.ts
│   │   │   ├── usuarios.routes.ts
│   │   │   ├── agendamentos.routes.ts
│   │   │   └── horarios-bloqueados.routes.ts
│   │   │
│   │   ├── 📂 db/              # Camada de dados
│   │   │   ├── 📂 schema/      # Schemas do banco
│   │   │   │   ├── usuarios.ts
│   │   │   │   ├── agendamentos.ts
│   │   │   │   ├── horarios-bloqueados.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📂 migrations/  # Migrações do banco
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── index.ts        # Configuração do Drizzle
│   │   │   └── seed.ts         # Dados iniciais (opcional)
│   │   │
│   │   ├── 📂 env/             # Variáveis de ambiente
│   │   │   └── index.ts
│   │   │
│   │   └── server.ts           # Arquivo principal do servidor
│   │
│   ├── drizzle.config.ts       # Configuração do Drizzle Kit
│   ├── tsconfig.json           # Configuração do TypeScript
│   ├── biome.json              # Configuração do Biome
│   ├── package.json            # Dependências do projeto
│   └── package-lock.json
│
├── docker-compose.yml          # Configuração do Docker para PostgreSQL
└── README.md                   # Este arquivo
```

### Organização por Camadas

#### Front-end
- **Apresentação**: HTML (estrutura)
- **Estilo**: CSS (visual)
- **Lógica**: JavaScript (comportamento)
- **Comunicação**: API Client (fetch)

#### Back-end
- **Rotas**: Definição dos endpoints
- **Controllers**: Validação de entrada e orquestração
- **Services**: Lógica de negócio
- **Database**: Acesso aos dados (ORM)

---

## 🔄 Como Funciona

### Fluxo de Requisição Completo

1. **Cliente faz uma ação** (ex: clica em "Agendar")
2. **Front-end captura o evento** e prepara os dados
3. **API Client** (`api.js`) faz a requisição HTTP para o back-end
4. **Servidor Fastify** recebe a requisição
5. **Rota** direciona para o controller apropriado
6. **Controller** valida os dados com Zod
7. **Service** executa a lógica de negócio
8. **Database** (via Drizzle ORM) executa queries no PostgreSQL
9. **Resposta** retorna através das camadas
10. **Front-end** atualiza a interface com os dados recebidos

### Exemplo Prático: Criar Agendamento

```mermaid
sequenceDiagram
    participant U as Usuário
    participant H as home.html
    participant JS as home.js
    participant API as api.js
    participant S as Server
    participant C as Controller
    participant SV as Service
    participant DB as PostgreSQL
    
    U->>H: Preenche formulário de agendamento
    U->>H: Clica em "Confirmar Agendamento"
    H->>JS: Evento submit do formulário
    JS->>JS: Valida dados no front-end
    JS->>API: api.criarAgendamento(dados)
    API->>API: Adiciona token JWT no header
    API->>S: POST /api/agendamentos<br/>Body: {data, horario, serviço, barbeiro}
    S->>C: AutenticacaoController.criar()
    C->>C: Valida JWT token
    C->>C: Valida dados com Zod
    C->>SV: AgendamentosService.criar()
    SV->>DB: Verifica se usuário existe
    DB-->>SV: Usuário encontrado
    SV->>DB: Verifica horários bloqueados
    DB-->>SV: Horários disponíveis
    SV->>SV: Valida disponibilidade
    SV->>DB: INSERT INTO agendamentos
    SV->>DB: INSERT INTO horarios_bloqueados
    DB-->>SV: Agendamento criado
    SV-->>C: Dados do agendamento
    C-->>S: JSON response
    S-->>API: Status 201 + dados
    API-->>JS: Promise resolve
    JS->>H: Exibe mensagem de sucesso
    JS->>H: Atualiza lista de agendamentos
    H->>U: Feedback visual de sucesso
```

### Sistema de Autenticação

1. **Cadastro/Login**: Usuário fornece credenciais
2. **Back-end valida**: Verifica email e senha no banco
3. **Gera JWT**: Cria token com dados do usuário (id, email)
4. **Retorna token**: Front-end recebe e armazena no localStorage
5. **Próximas requisições**: Token é enviado no header `Authorization: Bearer {token}`
6. **Validação**: Cada rota protegida verifica o token antes de processar

### Sistema de Horários Bloqueados

1. **Ao criar agendamento**: Sistema automaticamente bloqueia o horário do barbeiro
2. **Ao consultar disponibilidade**: Front-end busca horários bloqueados antes de exibir opções
3. **Ao cancelar**: Sistema desbloqueia o horário automaticamente
4. **Prevenção de conflitos**: Não permite criar dois agendamentos no mesmo horário para o mesmo barbeiro

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- Git (opcional, para clonar o repositório)

### Passo a Passo

#### 1. Clonar/Obter o Projeto

```bash
# Se estiver usando Git
git clone <url-do-repositorio>
cd Trabalho-PWEB-I
```

#### 2. Configurar o Banco de Dados

```bash
# Iniciar o PostgreSQL via Docker
docker-compose up -d

# Verificar se o container está rodando
docker ps
```

O PostgreSQL estará disponível em:
- **Host**: `localhost`
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Database**: `barbearia_db`

#### 3. Configurar o Back-end

```bash
# Entrar na pasta do servidor
cd server

# Instalar dependências
npm install

# Criar arquivo .env na pasta server/
# Conteúdo do .env:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/barbearia_db
```

#### 4. Executar Migrações do Banco

```bash
# Gerar migrações (se necessário)
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Popular banco com dados iniciais
npm run db:seed
```

#### 5. Iniciar o Servidor Back-end

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# O servidor estará rodando em http://localhost:3003
```

#### 6. Servir o Front-end

Você pode usar qualquer servidor HTTP estático. Algumas opções:

**Opção 1: Usando Python (recomendado para desenvolvimento)**
```bash
# Na raiz do projeto
python -m http.server 8000
# Acesse: http://localhost:8000/index/home.html
```

**Opção 2: Usando Node.js (http-server)**
```bash
# Instalar globalmente
npm install -g http-server

# Na raiz do projeto
http-server -p 8000
# Acesse: http://localhost:8000/index/home.html
```

**Opção 3: Usando VS Code Live Server**
- Instale a extensão "Live Server"
- Clique com botão direito em `index/home.html`
- Selecione "Open with Live Server"

### Verificação

1. ✅ Back-end rodando: Acesse `http://localhost:3003/ping` (deve retornar `{"message":"pong"}`)
2. ✅ Front-end rodando: Acesse `http://localhost:8000/index/login.html`
3. ✅ Banco de dados: Verifique com `docker ps` se o container está ativo

---

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/auth/cadastro` | Cadastra novo usuário | ❌ |
| `POST` | `/auth/login` | Realiza login | ❌ |
| `GET` | `/auth/verificar-token` | Verifica se token é válido | ✅ |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/usuarios/perfil` | Busca perfil do usuário logado | ✅ |
| `PUT` | `/api/usuarios/perfil` | Atualiza perfil do usuário | ✅ |

### Agendamentos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/agendamentos/meus-agendamentos` | Lista agendamentos do usuário | ✅ |
| `POST` | `/api/agendamentos` | Cria novo agendamento | ✅ |
| `GET` | `/api/agendamentos/:id` | Busca agendamento por ID | ✅ |
| `PUT` | `/api/agendamentos/:id` | Atualiza agendamento | ✅ |
| `PATCH` | `/api/agendamentos/:id/cancelar` | Cancela agendamento | ✅ |

### Horários Bloqueados

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/horarios-bloqueados` | Lista todos os horários bloqueados | ❌ |
| `GET` | `/api/horarios-bloqueados/data/:data` | Lista por data | ❌ |
| `GET` | `/api/horarios-bloqueados/buscar?nomeBarbeiro=X&data=Y` | Busca por barbeiro e data | ❌ |

### Exemplos de Requisições

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

#### Criar Agendamento
```http
POST /api/agendamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nomeBarbeiro": "Luciano Sousa Barbosa",
  "nomeServico": "Corte Masculino",
  "data": "2025-01-15",
  "horario": "14:30",
  "observacoes": "Corte na máquina 2"
}
```

---

## 🗄️ Banco de Dados

### Tabelas

#### `usuarios`
Armazena informações dos clientes cadastrados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `nome_completo` | TEXT | Nome completo do usuário |
| `email` | TEXT | Email (único) |
| `telefone` | TEXT | Telefone de contato |
| `senha` | TEXT | Senha (hash) |
| `data_nascimento` | DATE | Data de nascimento |
| `observacoes` | TEXT | Observações adicionais (opcional) |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

#### `agendamentos`
Armazena os agendamentos realizados pelos clientes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `usuario_id` | UUID | Referência ao usuário (FK) |
| `nome_barbeiro` | TEXT | Nome do barbeiro |
| `nome_servico` | TEXT | Nome do serviço |
| `data` | DATE | Data do agendamento |
| `horario` | TIME | Horário do agendamento |
| `status` | TEXT | Status (pendente, confirmado, concluido, cancelado, futuro) |
| `observacoes` | TEXT | Observações do cliente |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

#### `horarios_bloqueados`
Controla os horários indisponíveis dos barbeiros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `nome_barbeiro` | TEXT | Nome do barbeiro |
| `data` | DATE | Data do horário bloqueado |
| `horario` | TIME | Horário bloqueado |
| `motivo` | TEXT | Motivo do bloqueio (ex: "Agendamento") |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

### Relacionamentos

- **usuarios** → **agendamentos**: Um usuário pode ter vários agendamentos (1:N)
- **agendamentos** → **horarios_bloqueados**: Cada agendamento cria um horário bloqueado (1:1)

---

## 🎓 Fases do Projeto

### ✅ Fase 1 – Desenvolvimento da Interface Gráfica
- Estruturação HTML completa
- Estilização CSS responsiva
- Layout funcional e visualmente agradável

### ✅ Fase 2 – Interatividade e Conteúdo Dinâmico
- Manipulação do DOM com JavaScript
- Eventos e validações
- Conteúdo dinâmico

### ✅ Fase 3 – Cookies, Armazenamento Local e Padrões
- Implementação de localStorage
- Integração com API via Fetch
- Organização profissional do código
- Separação de responsabilidades

---

## 📝 Notas Técnicas

### Segurança

- ✅ Senhas devem ser hasheadas (preparado para bcrypt)
- ✅ JWT tokens com expiração de 7 dias
- ✅ Validação de dados no back-end com Zod
- ✅ CORS configurado para permitir requisições do front-end
- ✅ Tokens armazenados no localStorage (considerar httpOnly cookies em produção)

### Performance

- ✅ Fastify como servidor (alta performance)
- ✅ Queries otimizadas com Drizzle ORM
- ✅ Índices no banco de dados (via Drizzle)
- ✅ Lazy loading de imagens (preparado)

### Boas Práticas

- ✅ Separação de responsabilidades (MVC)
- ✅ Código TypeScript com tipagem forte
- ✅ Validação de schemas com Zod
- ✅ Tratamento de erros consistente
- ✅ Código organizado e documentado

---

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido para a disciplina de Programação Web I. Para contribuições ou sugestões, entre em contato com a equipe de desenvolvimento.

---

## 📄 Licença

Este projeto é de uso acadêmico e educacional.

---

## 👥 Autores

Desenvolvido como trabalho acadêmico para a disciplina de Programação Web I.

---

**Desenvolvido com ❤️ para a Barbearia Style**
