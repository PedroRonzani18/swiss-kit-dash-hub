# Variáveis de Ambiente

Este documento cobre somente variáveis existentes no estado atual do código.

## Frontend (`apps/web`)

Arquivo base: `apps/web/.env.example`

| Variável | Obrigatória | Desenvolvimento | Produção | Descrição |
| --- | --- | --- | --- | --- |
| `VITE_API_URL` | Não | Opcional. Exemplo: `http://localhost:3001/api` | Recomendado quando web e API não compartilham origem/proxy | URL base da API consumida pelo frontend. Se não definida, usa `/api`. |

Observação:
- Em desenvolvimento local, `/api` funciona com proxy do Vite para `http://localhost:3001`.

## API (`apps/api`)

Arquivo base: `apps/api/.env.example`

| Variável | Obrigatória | Desenvolvimento | Produção | Descrição |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | Não | default: `development` | usar `production` | Ambiente da aplicação. |
| `PORT` | Não | default: `3001` | definido pelo provider/plataforma | Porta HTTP da API. |
| `DATABASE_URL` | Condicional | necessária para recursos com banco | obrigatória para operação completa | String de conexão PostgreSQL usada pelo Prisma. |
| `WEB_APP_URL` | Não | default: `http://localhost:8080` | obrigatória na prática | URL da aplicação web (origem de confiança para OAuth e redirecionamentos). |
| `CORS_ALLOWED_ORIGINS` | Não | default: valor de `WEB_APP_URL` | obrigatória na prática | Lista de origens permitidas para CORS (separada por vírgula). |
| `AUTH_COOKIE_NAME` | Não | default: `swisskit_auth` | recomendado manter explícita | Nome do cookie de autenticação. |
| `AUTH_COOKIE_SAME_SITE` | Não | default: `lax` | geralmente `none` quando web/API estão em origens diferentes | Política `SameSite` do cookie (`lax`, `none`, `strict`). |
| `AUTH_COOKIE_SECURE` | Não | geralmente `false` em HTTP local | `true` em produção HTTPS | Flag `Secure` do cookie. |
| `AUTH_COOKIE_DOMAIN` | Não | normalmente vazio | opcional (ex: `.example.com`) | Domínio do cookie para compartilhamento entre subdomínios. |
| `GOOGLE_CLIENT_ID` | Sim | obrigatório | obrigatório | Client ID do Google OAuth. |
| `GOOGLE_CLIENT_SECRET` | Sim | obrigatório | obrigatório | Client secret do Google OAuth. |
| `GOOGLE_CALLBACK_URL` | Sim | obrigatório | obrigatório | URL de callback registrada no Google OAuth. |
| `JWT_SECRET` | Sim | obrigatório | obrigatório | Segredo de assinatura do JWT. |
| `JWT_EXPIRES_IN` | Não | default: `1d` | definir explicitamente | Duração do token (`1d`, `12h`, `30m` ou segundos positivos). |

## Regras importantes
- `AUTH_COOKIE_SAME_SITE=none` exige `AUTH_COOKIE_SECURE=true`.
- `CORS_ALLOWED_ORIGINS` deve incluir exatamente as origens que consomem a API.
- `GOOGLE_CALLBACK_URL` precisa casar com a URL registrada no Google Cloud.

## Guia rápido: dev vs produção

Desenvolvimento local (referência):
- frontend em `http://localhost:8080`
- API em `http://localhost:3001`
- `AUTH_COOKIE_SAME_SITE=lax`
- `AUTH_COOKIE_SECURE=false`

Produção (referência):
- `NODE_ENV=production`
- frontend/API em HTTPS
- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAME_SITE=none` quando houver chamada cross-site entre web e API
- `AUTH_COOKIE_DOMAIN` apenas se houver necessidade real de compartilhar cookie entre subdomínios
