# Plano de Implementação — Agendamento Google Agenda v1

> Decisões fechadas: **só duração** (preço fica no WhatsApp) + **OAuth da Ariana com refresh_token**
> + **hold 10 min + confirmação via WhatsApp** + **lembretes nativos do Google**.
> Infra: mantém GitHub + Worker atual. Data: 15/09/2026.

## 1. Objetivo v1 / fora de escopo

**Entrega:** escolher serviço → ver slots reais → segurar 10 min → criar evento
na agenda `Atendimentos Studio` → gerar link WhatsApp pré-preenchido +
`Adicionar ao meu calendário`. Fallback 100% WhatsApp se a API falhar.

**Fora da v1:** pagamento/sinal Pix, cron WhatsApp automático, painel admin,
ficha anamnese, multiprofissional, webhook push do Google.

## 2. Arquitetura (mantém infra atual)

- Mesmo repo `Ellie-gg/studioarianaweber`, mesmo deploy `sites-origin` → Worker `worker/index.ts`.
- Backend = Route Handlers Next em `app/api/*` rodando no Worker (`nodejs_compat` já ativo em `vite.config.ts`).
- Google via `fetch` direto (`freebusy.query` + `events.insert`), sem SDK `googleapis` (pesado p/ Worker).
- Persistência = D1 + Drizzle (`db/schema.ts` hoje vazio, `db/index.ts` já espera binding `DB`).
  Ativar com `"d1": "DB"` em `.openai/hosting.json` — mesma infra.
- Segredos nunca no Git (`.gitignore` já ignora `.env*`):
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`,
  `GOOGLE_CALENDAR_ID`, `BOOKING_TIMEZONE=America/Sao_Paulo`.

## 3. Modelo de dados (Drizzle sqlite)

Em `db/schema.ts` (novo):

- `services_ext(service_name PK, duration_min INT, buffer_min INT)` — seed a partir de
  `src/content/services.ts` + duração real a coletar. Ex.: Limpeza 60+15, Dermaplaning 50+10.
- `business_hours(weekday INT 0-6, open TEXT, close TEXT)` + `business_exception(date TEXT, open/close NULL)`
  — resolve `site.hours = TODO_CLIENTE` em `src/config/site.ts`.
- `booking_holds(id, service_name, start_utc, end_utc, expires_at, client_name, client_wa, status)`
  — hold de 10 min.
- `appointments(id, service_name, client_name, client_wa, start_utc, end_utc, google_event_id UNIQUE, status, created_at)`
  — `status: held/confirmed/cancelled`.

Migration via `drizzle-kit generate` (`drizzle.config.ts`) + `npm run build` valida.

## 4. Camada Google `src/lib/google-calendar.ts` (novo)

- `getAccessToken()` — `POST oauth2.googleapis.com/token` com refresh_token, cache em memória ~50 min.
- `queryFreeBusy(timeMin/Max)` — 1 chamada agregada por semana.
- `createEvent({summary, start, end, description, reminders})` — `events.insert` com
  `extendedProperties.private: {source:'site', appointment_id}`,
  `reminders: {useDefault:false, overrides:[{method:'popup',minutes:1440},{method:'popup',minutes:180}]}`.
- `deleteEvent()` para cancelamento.
- Erros: `401 → refresh 1x`, `403/429 → fallback WhatsApp + log`, setup `redirect_uri_mismatch` documentado
  em `docs/setup-google-agenda-profissional.md`.

## 5. APIs (novas, server-only)

- `GET /api/config` — serviços com `duration_min` + dias abertos (sem expor segredos).
- `GET /api/availability?service=X&from=YYYY-MM-DD&days=7` — grade a partir de
  `business_hours` − `freebusy` − holds válidos − appointments. Slots 15/30 min, timezone SP, passado bloqueado.
- `POST /api/hold {service, start, client_name, client_wa}` — valida, recheca freebusy, cria hold 10 min,
  retorna `hold_id + expires_at`.
- `POST /api/book {hold_id}` — revalida hold, `events.insert`, insere appointment, consome hold,
  retorna `whatsappLink` (reuso de `src/config/site.ts`) + `google_add_url`.
- `POST /api/cancel {appointment_id}` — marca cancelled + `deleteEvent`. V1: cancela com `id + wa`.
- Rate-limit simples no Worker + validação manual (evitar dep nova se possível).

## 6. Frontend (editar `src/components/SiteClient.tsx`)

Manter landing idêntica; agendamento entra no `dialog` atual:

1. Serviço pré-selecionado (vem do card).
2. Data (7 dias, pula fechado) → grid slots → `fetch /api/availability`.
3. Nome + WhatsApp (valida DDD) → `POST /hold` → countdown 10:00.
4. Sucesso → `[Confirmar no WhatsApp]` + `[Adicionar ao meu Google Calendar]` + política canc. 24 h.

Estados: loading skeleton, vazio ("sem horário — chamar no WhatsApp"), erro API → CTA WhatsApp direto.
Estilos só em `app/globals.css` com tokens `--plum/pearl/champagne`, mobile-first igual `service-stack`.
Analytics: reusar `track()` em `src/lib/analytics.ts` com `slot_view/hold_created/booking_confirmed`.

## 7. Config / conteúdo

- `src/config/site.ts` + `src/content/services.ts` — adicionar `duration_min/buffer_min` (sem preço),
  preencher `hours` real, nova flag `features.booking: true`.
- `.env.example` (novo) com as 5 vars sem valores.
- Reuso do guia `docs/setup-google-agenda-profissional.md` — dev só cola a redirect URI exata.

## 8. Testes / deploy

- Atualizar `tests/rendered-html.test.mjs` p/ cobrir novo fluxo sem quebrar asserts atuais.
- Novos testes `node:test`: slots (timezone, buffer, hold expirado), mock fetch Google.
- `npm run build` + `npm test` local, push `origin main` depois `sites-origin`.
  D1: 1 campo + `migrations apply` via control plane.

## 9. LGPD / segurança

Mínimo necessário (nome, WA, serviço, horário) no evento; sem dado sensível de saúde na descrição.
Agenda profissional separada, não pública. Secret só em env do Worker.
Revogação: `myaccount.google.com/connections`. Após setup, remover dev do IAM.

## 10. Fases estimadas

1. Schema + seed durações + `/config` (0,5 d)
2. Lib Google + token refresh (0,5 d)
3. `/availability + /hold + /book + /cancel` (1,5 d)
4. UI modal 4 passos + CSS + fallback WA (1,5 d)
5. Testes + `.env.example` + `hours` reais + deploy D1 (0,5 d)

Total ~4–5 d.
