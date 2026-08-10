# ADR-001: Stack Vue + Vite + Tailwind + GitHub Pages

- Status: Accepted
- Date: 2026-08-10

## Context

Precisamos de um site mobile-first para a Central Jovem, hospedado no GitHub Pages, começando pela divulgação do culto “Constantes” e com crescimento previsto (reflexão, anúncios, possíveis integrações).

## Decision

Usar **Vue 3 + Vite + Tailwind CSS + Vue Router (hash)**, com deploy via **GitHub Actions → GitHub Pages**.

## Alternatives considered

- **HTML + jQuery + Tailwind CDN**: simples no dia 1, frágil ao crescer páginas e componentes; CDN Tailwind inadequado para produção.
- **HTML multi-página + Vite + Tailwind sem Vue**: viável, mas menos reutilização para o roadmap.
- **History mode no Router**: URLs limpas, porém exige workaround `404.html` no Pages; adiado.

## Consequences

- Positivo: componentes, build estático, pipeline de deploy, base para novas rotas.
- Negativo: curva de Node/npm para quem só edita HTML; Node 22+ recomendado no CI.
- Aceito: dark theme nativo da marca (logos em fundo preto).

## Future impact

Drive, calendários e CMS podem entrar depois como fontes de dados estáticas ou APIs; a stack atual não impede e não antecipa abstrações desnecessárias.
