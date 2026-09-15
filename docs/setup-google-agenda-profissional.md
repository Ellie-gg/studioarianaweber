# Configurar Google Agenda do Studio pelo Celular — Passo a Passo para a Profissional

> Quem deve fazer: **a própria profissional (Ariana)**, na **conta Google do studio**
> (ex: `studioarianaweber@gmail.com`). Não fazer na conta pessoal do desenvolvedor.
> Tempo: ~20–30 min pelo celular. Grátis, sem cartão, sem faturamento.
> Última verificação dos caminhos: **15/09/2026** (console novo = `Google Auth Platform`).

Por que tem que ser você:
- Você é a **dona dos dados** (nome, telefone e procedimento das clientes = dado pessoal/LGPD).
- Se o projeto for do dev e ele sair, você perde tudo.
- Sendo seu, você revoga o acesso do site em 1 clique quando quiser.

---

## 0. Preparar o celular (2 min)

Funciona nos dois, mas o caminho muda um pouco:

**Android (Chrome):**
1. Abra o **Chrome** (não o app Agenda, não o app Google Cloud).
2. Faça login com a **conta do studio**: acesse `accounts.google.com` e confirme que está na conta certa (foto/inicial no canto superior).
3. Para cada etapa abaixo, ative o modo computador: toque em `⋮ (três pontos, canto superior)` > marque **`Versão para computador` / Desktop site`.
4. Dica: vire o celular na horizontal (paisagem) e use zoom com dois dedos — o console é feito para PC.

**iPhone:**
1. Use o **Chrome para iOS** (melhor que Safari para o console). Instale pela App Store se não tiver.
2. Faça login com a conta do studio em `accounts.google.com`.
3. Ative modo computador: toque em `···` ou `⫶` > **`Solicitar site para computador` / Desktop site**.
4. Se algo não carregar, tente o **Safari**: `aA na barra de endereço > Solicitar Site para Computador`.

> O app **Google Agenda** e o app **Google Cloud** sozinhos **não completam** este processo. Use o **Chrome + modo computador**. Isso é limitação oficial do Google.

---

## Parte A — Criar a agenda `Atendimentos Studio` (5 min)

> Atenção oficial Google: **nova agenda só pode ser criada no navegador**, não no app Agenda. Depois de criada ela aparece no app normalmente.

1. No Chrome (modo computador ativado), acesse: `https://calendar.google.com`
2. No painel esquerdo, ao lado de **Outras agendas**, toque em **`+` > Criar nova agenda**.
   - Se no celular o `+` não aparecer, confirme que o modo computador está ligado e recarregue.
3. Preencha:
   - **Nome:** `Atendimentos Studio`
   - **Descrição:** `Reservas feitas pelo site do Studio Ariana Weber`
   - **Fuso horário:** `America/Sao_Paulo` (em `Configurações > Fuso horário`, se pedir)
4. Toque em **Criar agenda**.
5. Abra o app **Google Agenda** no celular > menu `☰` > confirme que `Atendimentos Studio` aparece marcado. Pode levar 1–2 min para sincronizar.
6. **Não deixe a agenda pública.** Em `Configurações da agenda > Permissões de acesso`, deixe **desmarcado** `Disponibilizar publicamente`. O site acessa via permissão segura (OAuth), não precisa ser pública.

Pronto da Parte A: você agora tem uma agenda profissional separada da pessoal.

---

## Parte B — Criar o projeto no Google Cloud (3 min)

1. No Chrome (modo computador), acesse: `https://console.cloud.google.com/projectcreate`
2. Preencha:
   - **Nome do projeto:** `studio-ariana-weber`
   - **Organização/Local:** deixe `Sem organização` (normal para conta Gmail).
   - **Conta de faturamento:** não precisa vincular para Calendar API. Se pedir, pule/feche.
3. Toque em **Criar**. Aguarde 1–2 min. O console vai para o Painel.
4. Confirme no topo (seletor de projeto) que está em `studio-ariana-weber`. Se estiver em outro, troque.

---

## Parte C — Ativar a Google Calendar API (2 min)

1. Acesse: `https://console.cloud.google.com/apis/library`
2. Confirme que o projeto selecionado no topo é `studio-ariana-weber`.
3. Na busca digite: **`Google Calendar API`**.
4. Abra o resultado `Google Calendar API` > toque em **Ativar / Enable**.
5. Aguarde ativar (botão vira `Gerenciar`).

---

## Parte D — Configurar a tela de consentimento OAuth — Google Auth Platform (8 min)

É aqui que o layout mudou em 2025–2026. Não procure mais `APIs e Serviços > Tela de consentimento` antiga. O caminho novo é:

### D1. Branding (informações do app)

1. Acesse: `https://console.cloud.google.com/auth/branding`
2. Se aparecer `Google Auth Platform ainda não configurada`, toque em **`Get started / Começar`** (canto inferior direito).
3. Preencha o assistente de 4 etapas na mesma página:
   - **1. App Information:**
     - **App name:** `Studio Ariana Weber`
     - **User support email:** selecione seu e-mail do studio
   - **2. Audience (Tipo de usuário):** escolha **`Externo / External`**.
     > Não escolha `Interno` — só funciona para Workspace corporativo. `Externo` não pode ser trocado depois sem criar projeto novo.
   - **3. Contact Information:** e-mail do studio para notificações do Google.
   - **4. Finish:** marque `Concordo com a Política de Dados do Usuário` > **Create / Continuar > Criar**.
4. Toque em **Próxima** entre etapas até concluir.

### D2. Audience — adicionar você como usuária de teste

App `Externo` nasce em modo **Teste**: só quem está na lista consegue autorizar. Sem isso dá erro `403 access_blocked`.

1. Acesse: `https://console.cloud.google.com/auth/audience`
2. Em **Test users / Usuários de teste** > **Add users / Adicionar usuários**.
3. Digite seu e-mail do studio > **Salvar**.

### D3. Data Access — escopos mínimos

1. Acesse: `https://console.cloud.google.com/auth/scopes`
2. Toque em **Add or remove scopes / Adicionar ou remover escopos**.
3. Marque **somente**:
   - `https://www.googleapis.com/auth/calendar.readonly` (ver disponibilidade)
   - `https://www.googleapis.com/auth/calendar.events` (criar/editar reservas)
4. Toque em **Update / Salvar**.
   > Não marque Drive, Gmail, contatos ou `calendar.settings`. Princípio do mínimo necessário (LGPD).

---

## Parte E — Criar o Cliente OAuth Web (5 min)

1. Acesse: `https://console.cloud.google.com/auth/clients/create`
2. Toque em **Create Client / Criar cliente**.
3. Preencha:
   - **Application type / Tipo de aplicativo:** `Aplicativo da Web / Web application`
   - **Name / Nome:** `site-studio-ariana-weber-prod`
   - **Authorized JavaScript origins:** deixe em branco (nosso backend faz a troca).
   - **Authorized redirect URIs / URIs de redirecionamento autorizados:** **peça ao dev o valor exato** antes de salvar (ex: `https://seu-site/api/auth/google/callback` — 1 letra errada dá `redirect_uri_mismatch`). Dá para adicionar mais de um (produção + localhost do dev).
4. Toque em **Create / Criar**.
5. Vai abrir a janela **OAuth client created** com:
   - **Client ID** (`...apps.googleusercontent.com`) — pode compartilhar com o dev.
   - **Client Secret** (`GOCSPX-...`) — **aparece UMA VEZ SÓ**. A partir de 2025 o Google esconde depois.
6. Na hora:
   - Toque em **Download JSON**, salve em local seguro (gerenciador de senhas, ex: Bitwarden/1Password) e **apague o arquivo do celular depois**.
   - **Nunca** mande o Secret por WhatsApp, print, e-mail ou commite no GitHub. Combine com o dev uma forma segura (cofre/compartilhamento temporário).
   - Se vazar/perder: volte em `Clients > seu cliente > Add/Revoke secret` para gerar um novo e invalidar o antigo.

---

## Parte F — Dar acesso temporário ao dev (opcional, 2 min)

Para o dev configurar sem pedir sua senha:

1. Acesse: `https://console.cloud.google.com/iam-admin/iam`
2. **Grant access / Conceder acesso** > **New principals / Novos membros:** e-mail do dev.
3. Papel/Role: **`Editor`** (só durante a configuração).
4. Depois que o agendamento funcionar, volte na mesma tela e **Remova** o dev.

Você nunca precisa informar sua senha Google ao dev.

---

## Parte G — O que mandar para o dev

Mande somente isto, por canal seguro:

- [ ] Nome do projeto: `studio-ariana-weber`
- [ ] ID da agenda: `Atendimentos Studio` (ou o e-mail da agenda, visível em `Configurações da agenda > Integrar agenda`)
- [ ] `Client ID` (público, ok mandar)
- [ ] `Client Secret` (secreto — só via cofre, nunca no Git/WhatsApp)
- [ ] Horários de atendimento + duração por serviço + intervalo/buffer (ex: 15 min) + política de cancelamento (ex: até 24h antes)
- [ ] URI de redirect exata combinada (para não dar `mismatch`)

Não mande: senha Google, JSON baixado por canal inseguro, acesso permanente de `Owner/Proprietário`.

Como revogar quando quiser: `https://myaccount.google.com/connections` ou `Segurança > Acesso de terceiros` > remover `Studio Ariana Weber`.

---

## Deu erro? (celular)

| Erro | Causa | O que fazer |
|---|---|---|
| Não acho `Criar nova agenda` no app | Limitação oficial | Usar `calendar.google.com` no Chrome + modo computador, não o app |
| `403 access_blocked` / `access_denied` | Faltou test user | Voltar em `/auth/audience` e adicionar seu e-mail |
| `redirect_uri_mismatch` | URI com diferença de `https`, barra `/` final ou porta | Copiar/colar exata do dev, sem digitar à mão |
| Secret sumiu | Normal pós-2025 | Gerar novo em `Clients > Add/Revoke secret` |
| Console quebrado no celular | Sem modo computador | Ativar `Versão para computador`, girar para paisagem, recarregar |
| Agenda não aparece no app | Sync | App Agenda > `☰ > Atualizar`, confirmar conta certa e agenda marcada |

---

## Nota rápida LGPD

- Controladora: Studio Ariana Weber. Operador: desenvolvedor/site. Agenda `Atendimentos Studio` separada da pessoal.
- Coletar só o mínimo na reserva (nome, WhatsApp, serviço, horário). Antes/depois e depoimentos só com autorização escrita.
- Este guia não cria vínculo de acesso permanente — após setup, remova o dev do IAM e guarde o Secret em cofre.

## Checklist final

- [ ] Agenda `Atendimentos Studio` criada e visível no app
- [ ] Projeto `studio-ariana-weber` criado
- [ ] `Google Calendar API` ativada
- [ ] Auth Platform `Externo` + você em Test users + 2 escopos mínimos
- [ ] Cliente Web criado + JSON guardado em cofre
- [ ] Dev removido do IAM após funcionar
- [ ] Horários/durações/política enviados ao dev
