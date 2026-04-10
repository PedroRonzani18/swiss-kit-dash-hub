# ADR 0002: Autenticação por cookie com domínio customizado

## Contexto
A aplicação usa login com Google OAuth e precisa manter sessão autenticada no browser de forma segura.

Requisitos principais:
- evitar exposição de token em armazenamento JavaScript do cliente;
- suportar frontend e API em origens/domínios distintos em produção;
- manter compatibilidade com fluxo OAuth em popup e callback dedicado.

## Decisão
Adotar autenticação baseada em JWT armazenado em cookie HttpOnly, com parâmetros configuráveis por ambiente:
- `AUTH_COOKIE_NAME`
- `AUTH_COOKIE_SAME_SITE`
- `AUTH_COOKIE_SECURE`
- `AUTH_COOKIE_DOMAIN` (opcional)

Complementos da decisão:
- callback OAuth emite cookie e retorna sinalização para o frontend via `postMessage` restrito ao `WEB_APP_URL`;
- CORS configurado com `credentials: true` e allowlist por `CORS_ALLOWED_ORIGINS`;
- guarda global JWT valida cookie (com fallback para Bearer em clientes não-browser).

## Consequências
Positivas:
- menor superfície de exposição do token no frontend;
- maior controle de sessão para cenários com domínio customizado/subdomínios;
- integração clara entre OAuth callback e estabelecimento de sessão.

Trade-offs:
- configuração de ambiente mais sensível (CORS, callback, cookie flags);
- exige HTTPS em produção quando `SameSite=None` (`Secure=true` obrigatório);
- falhas de alinhamento entre domínios podem interromper login/sessão.
