# Deployment

## Estado atual
No estado atual do repositório:
- o deploy é operacional (configurado no provider), não versionado como IaC neste repo;
- não existe `railway.toml` no código-fonte;
- o projeto é publicado com frontend e API em serviços separados no Railway.

## Topologia de publicação
- Serviço `web` (frontend Vite buildado e servido pelo serviço web).
- Serviço `api` (NestJS + Prisma).
- Banco PostgreSQL acessado pela API via `DATABASE_URL`.

## Railway

### API
Comandos de referência (usando scripts já existentes):
- Build: `pnpm --filter api build`
- Start: `pnpm --filter api start:prod`

Etapas importantes:
1. Configurar variáveis de ambiente da API (`apps/api/.env.example` como base).
2. Garantir `DATABASE_URL` apontando para PostgreSQL válido.
3. Executar migrações Prisma antes (ou durante) o rollout: `pnpm --filter api prisma:migrate:deploy`.
4. Validar health checks após deploy:
- `GET /api/health/live`
- `GET /api/health/ready`

### Frontend
Comandos de referência:
- Build: `pnpm --filter web build`
- Serve: `pnpm --filter web preview`

Configuração essencial:
- definir `VITE_API_URL` quando não houver proxy/rewrite para `/api` na mesma origem;
- validar acesso ao endpoint `/api/auth/me` a partir do domínio final do frontend.

## Domínio customizado e OAuth callback
Para autenticação Google funcionar em produção:
1. Defina os domínios finais de frontend e API no Railway.
2. Atualize na API:
- `WEB_APP_URL`
- `CORS_ALLOWED_ORIGINS`
- `GOOGLE_CALLBACK_URL`
3. Atualize no Google Cloud Console a URI de callback autorizada para o mesmo `GOOGLE_CALLBACK_URL`.
4. Ajuste cookie para cenário cross-site:
- `AUTH_COOKIE_SAME_SITE=none`
- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_DOMAIN` opcional (quando precisar compartilhar entre subdomínios).

## Passos gerais de deploy/redeploy
1. Subir mudanças e garantir CI verde (`lint`, `typecheck`, `test`, `build`).
2. Aplicar/configurar variáveis de ambiente no Railway.
3. Publicar API e aplicar migrações (`prisma:migrate:deploy`).
4. Validar health checks e Swagger da API.
5. Publicar frontend.
6. Testar login Google, sessão (`/auth/me`), entrada protegida em `/app`, redirect legado de `/financeiro/*` e health checks.

## Pontos sensíveis de produção
- Divergência entre `GOOGLE_CALLBACK_URL` e callback cadastrado no Google causa falha de login.
- CORS incorreto impede envio de credenciais/cookies do browser.
- `AUTH_COOKIE_SAME_SITE=none` sem `AUTH_COOKIE_SECURE=true` quebra autenticação.
- `DATABASE_URL` ausente/errado mantém API de pé, mas readiness ficará indisponível.
- Acesso depende de e-mail ativo em `AllowedEmail`.
