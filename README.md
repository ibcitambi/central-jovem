# Central Jovem

Site da juventude da **Igreja Batista Central em Itambi**.

- Stack: Vue 3 + Vite + Tailwind CSS
- Hospedagem: [GitHub Pages](https://ibcitambi.github.io/central-jovem/)

## Desenvolvimento

```bash
npm install
npm run dev
```

Build local:

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) gera o `dist/` e publica na branch **`gh-pages`** a cada push em `main`.

### Configuração no GitHub (necessário uma vez)

1. Abra: https://github.com/ibcitambi/central-jovem/settings/pages
2. **Build and deployment → Source:** `Deploy from a branch`
3. **Branch:** `gh-pages` / `/ (root)` → **Save**

URL: `https://ibcitambi.github.io/central-jovem/`

O `base` do Vite está em `/central-jovem/` ([`vite.config.js`](vite.config.js)).

> Não use a branch `main` como origem do Pages — ela tem o código-fonte Vue, não o site compilado.

## Conteúdo atual

Landing do culto **Constantes** (16/08), com 1 Coríntios 15:58 e link da [playlist no YouTube](https://youtube.com/playlist?list=PLUa59kdjq5Hg&si=fzKv_tEZ7BeQzE4H).
