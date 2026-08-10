# Arquitetura — Central Jovem

## Visão

Site estático da juventude **Central Jovem** (Igreja Batista Central em Itambi), gerado com Vue 3 + Vite e publicado no GitHub Pages. Sem backend no MVP.

## Camadas

| Camada | Responsabilidade |
|--------|------------------|
| `src/pages` | Views / rotas |
| `src/components` | UI reutilizável (header, hero, verso, footer) |
| `src/router` | Rotas (hash history no Pages) |
| `public/` | Assets estáticos (logos, fundo) |
| `.github/workflows` | Build + deploy Pages |

## Decisões

- **Hash history** no Vue Router: evita fallback `404.html` no GitHub Pages no dia 1.
- **`base: '/central-jovem/'`**: site em project page, não em user/org root.
- **Tailwind via Vite plugin**: CSS processado no build; adequado a hospedagem estática.
- Tokens de marca (preto, azul, vermelho, amarelo) alinhados às logos em `public/`.

## Evolução prevista

Reflexão, anúncios, possível integração com Drive/calendário — preferir novas rotas/páginas e componentes, sem introduzir backend até haver requisito claro.

Ver [ADR-001](adr/001-stack-vue-vite-tailwind-pages.md).
