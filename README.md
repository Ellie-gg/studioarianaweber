# Studio Ariana Weber Estética

Landing page static-first, mobile-first e preparada para converter visitas do Instagram em conversas no WhatsApp.

## Como adaptar para uma nova cliente

1. Atualize marca, canais, dados locais, mensagens de WhatsApp e SEO em `src/config/site.ts`.
2. Troque as cores em `src/config/theme.ts` e nas variáveis em `app/globals.css`.
3. Edite tratamentos em `src/content/services.ts`; cada item aceita categoria, benefícios, indicação, duração e mensagem específica.
4. Coloque fotografias autorizadas em `public/images` e atualize os caminhos usados nos componentes. Até isso acontecer, os espaços reservados permanecem claramente identificados.
5. Inclua depoimentos e FAQ reais em `src/content/testimonials.ts` e `src/content/faq.ts`, depois habilite as respectivas chaves em `site.features`.

## Dados ainda necessários da cliente

- Horários de atendimento.
- Imagens autorizadas de resultados (antes/depois).
- Formação, especialidades, duração dos tratamentos, formas de pagamento, políticas de cancelamento/remarcação e cuidados antes/depois.
- Depoimentos reais aprovados e eventuais informações legais de privacidade.

Enquanto essas informações não forem fornecidas, o projeto usa `TODO_CLIENTE` de forma centralizada e mantém as seções sem conteúdo confirmado ocultas.
