# 📸 Portfólio Fotográfico — Book Theme

Site profissional de fotógrafo com animação de abertura de livro 3D na entrada.

## Estrutura do Projeto

```
book/
├── index.html                   # Página principal
├── data/
│   └── gallery.json             # Dados das fotos, serviços, depoimentos
├── assets/
│   ├── css/
│   │   ├── variables.css        # Design tokens (cores, fontes, espaçamento)
│   │   ├── reset.css            # Normalização CSS
│   │   ├── book.css             # Animação 3D do livro (intro)
│   │   ├── portfolio.css        # Layout e componentes do site
│   │   ├── animations.css       # Scroll reveal, cursor, transições
│   │   └── responsive.css       # Media queries (mobile-first)
│   ├── js/
│   │   ├── book-animation.js    # Lógica de abertura do livro
│   │   ├── gallery.js           # Grid de fotos + lightbox
│   │   ├── navigation.js        # Navbar + scroll suave + links ativos
│   │   └── main.js              # Cursor, scroll reveal, contador, form
│   └── images/
│       ├── gallery/             # ← Adicione suas fotos aqui
│       │   └── photo-01.jpg … photo-12.jpg
│       └── ui/
│           ├── photographer.jpg # Sua foto (seção Sobre)
│           └── avatar-*.jpg     # Fotos dos clientes (depoimentos)
```

## Como Usar

### 1. Adicionar suas fotos

Coloque suas fotos em `assets/images/gallery/` com os nomes:
```
photo-01.jpg
photo-02.jpg
...
photo-12.jpg
```

> Tamanho recomendado: **1200×900px** para paisagem, **900×1200px** para retrato.  
> Formato: JPEG (qualidade 80–90%), WebP recomendado.

### 2. Personalizar informações

Edite `data/gallery.json` para atualizar:
- Nome, e-mail, telefone e Instagram
- Títulos e categorias das fotos
- Textos dos depoimentos
- Serviços e preços

Edite `index.html` para atualizar:
- Nome na navbar e no rodapé
- Descrição do hero
- Textos da seção Sobre

### 3. Personalizar identidade visual

Edite `assets/css/variables.css` para mudar:
- Cores (`--color-gold`, `--color-bg`, etc.)
- Fontes (`--font-display`, `--font-body`)
- Tamanho do livro (`--book-width`, `--book-height`)

### 4. Abrir no navegador

Basta abrir `index.html` no navegador.  
Para funcionar completamente (fetch do JSON), use um servidor local:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| 🎬 Animação do Livro | Cover 3D em CSS com `perspective` e `rotateY` |
| 🖼️ Galeria Masonry | Grid responsivo com filtro por categoria |
| 🔍 Lightbox | Visualizador com navegação por teclado e touch |
| 🖱️ Cursor Customizado | Cursor dourado com ring de seguimento suave |
| ✨ Scroll Reveal | Elementos animam ao entrar na viewport |
| 📊 Contadores | Números animados ao rolar até a seção Sobre |
| 💬 Slider | Depoimentos com auto-play e dots |
| 📱 Responsivo | Mobile, tablet e desktop |
| ♿ Acessível | ARIA labels, navegação por teclado, reduced-motion |
| 📝 Formulário | Validação e estado de sucesso |

## Tecnologias

- **HTML5** — Semântico e acessível
- **CSS3** — Custom properties, Grid, Flexbox, animações 3D
- **JavaScript (ES6+)** — Módulos IIFE, Intersection Observer, requestAnimationFrame
- **Google Fonts** — Playfair Display + Lato
- **JSON** — Dados da galeria separados do markup

Sem dependências externas. Sem build tools. Funciona direto no navegador.

---

Desenvolvido com foco em performance, acessibilidade e experiência visual.
