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

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica automaticamente a pasta `dist/` em todo push em `main` (ou `master`).

### Configuração única no GitHub

1. Abra o repositório: https://github.com/ibcitambi/central-jovem
2. **Settings → Pages**
3. Em **Build and deployment → Source**, escolha **GitHub Actions**
4. Faça push deste projeto na branch `main` (ou rode o workflow manualmente em **Actions → Deploy GitHub Pages → Run workflow**)

URL esperada: `https://ibcitambi.github.io/central-jovem/`

O `base` do Vite está em `/central-jovem/` ([`vite.config.js`](vite.config.js)).

## Conteúdo atual

Landing do culto **Constantes** (16/08), com 1 Coríntios 15:58 e link da [playlist no YouTube](https://youtube.com/playlist?list=PLUa59kdjq5Hg&si=fzKv_tEZ7BeQzE4H).
