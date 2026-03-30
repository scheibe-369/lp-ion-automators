# PRD — Landing Page ION + Automators Club (Turma Inaugural)

## 1. CONTEXT

Landing page de vendas dark mode para o bundle "ION + Automators Club — Turma Inaugural". O produto combina dois cursos/comunidades da Growth Hub: ION (IA aplicada a processos comerciais) e Automators Club (automação com n8n em produção). A turma inaugural oferece 8 semanas de calls ao vivo semanais com Helio e equipe, suporte a projetos reais, grupo exclusivo, e acesso vitalício ao conteúdo gravado.

A LP tem um único objetivo: levar o visitante ao checkout externo na Hubla. Não há login, dashboard, área de membros ou qualquer funcionalidade além da conversão. A página é estática, servida via CDN, com um único elemento dinâmico: o contador regressivo real baseado na data de encerramento (07/05/2026).

**Constraint mais importante**: Esta é uma página de conversão. Cada decisão de design e código deve servir ao objetivo de maximizar cliques no CTA de checkout. Performance (< 2s de carregamento), legibilidade e hierarquia visual são inegociáveis.

---

## 2. TECH STACK

| Component | Technology | Version | Non-Negotiable |
|-----------|-----------|---------|----------------|
| Framework | Astro | 5.x (latest) | ✅ |
| Linguagem | TypeScript | 5.x | ✅ |
| Estilização | Tailwind CSS | 4.x | ✅ |
| Deploy | Cloudflare Pages | — | ✅ |
| Checkout | Hubla (externo) | — | ✅ |
| Fontes | Inter (corpo) + Space Grotesk (headlines) | Google Fonts | ✅ |
| Ícones | Lucide Icons (via astro-icon) | latest | Não |
| Animações | CSS nativo + Intersection Observer | — | ✅ |

### Justificativa da stack

**Astro sobre Next.js**: Esta é uma LP 100% estática com um único elemento interativo (contador). Astro gera zero JavaScript por default e hidrata apenas ilhas interativas. Benchmarks mostram carregamento ~40% mais rápido e ~90% menos JS que Next.js para sites estáticos. Deploy nativo em Cloudflare Pages sem adaptador de servidor. Next.js é overkill — requer runtime React (87KB mínimo comprimido) mesmo para uma página em branco.

**Astro sobre HTML puro**: Astro permite componentização (seções reutilizáveis), TypeScript, Tailwind integrado, otimização automática de imagens, e build com tree-shaking — sem sacrificar a saída estática. Manutenção e iteração são significativamente mais fáceis.

**Tailwind CSS 4**: Configuração mínima, classes utilitárias, dark mode nativo, e integração oficial com Astro. Elimina a necessidade de arquivos CSS separados.

---

## 3. PROJECT STRUCTURE

```
lp-ion-automators/
├── astro.config.mjs            # Astro config com Tailwind e adapter Cloudflare
├── tailwind.config.mjs         # Tokens de design (cores, fontes, spacing)
├── tsconfig.json               # TypeScript config
├── package.json
├── .gitignore
├── .env                        # Variáveis configuráveis (datas, preços, URLs)
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg            # Open Graph image (1200x630)
│   ├── fonts/                  # Fallback local das fontes (se necessário)
│   └── logos/
│       ├── ion-white.svg       # Logo ION (versão branca para fundo escuro)
│       ├── automators-white.svg # Logo Automators Club (versão branca)
│       └── ion-automators-bundle.svg # Logo combinada do bundle
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Layout base: head, meta, fonts, body wrapper
│   ├── pages/
│   │   └── index.astro         # Página única — monta todas as seções
│   ├── components/
│   │   ├── Header.astro        # Navbar fixa: logo + CTA sticky
│   │   ├── Hero.astro          # Seção 01: badge urgência + headline + sub + CTA + prova social
│   │   ├── Problem.astro       # Seção 02: quebra de crença + 3 cards de impacto
│   │   ├── Solution.astro      # Seção 03: ION card + Automators card + faixa bundle
│   │   ├── Differentials.astro # Seção 04: extras da turma + countdown
│   │   ├── Curriculum.astro    # Seção 05: conteúdo incluso + extras listados
│   │   ├── Journey.astro       # Seção 06: stepper 4 passos pós-compra
│   │   ├── ForWho.astro        # Seção 07: para quem é / não é
│   │   ├── Instructors.astro   # Seção 08: Helio + equipe (placeholder)
│   │   ├── Cases.astro         # Seção 09: resultados e cases (placeholder)
│   │   ├── Testimonials.astro  # Seção 10: depoimentos (placeholder)
│   │   ├── Pricing.astro       # Seção 11: âncora de valor + preço + CTA
│   │   ├── Guarantee.astro     # Seção 12: garantia 7 dias
│   │   ├── FAQ.astro           # Seção 13: accordion FAQ
│   │   ├── FinalCTA.astro      # Seção 14: CTA final + countdown + urgência
│   │   ├── WhatsAppForm.astro  # Seção 15: formulário contato WhatsApp
│   │   ├── Footer.astro        # Rodapé: logos + links legais
│   │   ├── Countdown.astro     # Componente reutilizável: contador regressivo (island)
│   │   ├── CTAButton.astro     # Componente reutilizável: botão CTA
│   │   ├── SectionHeadline.astro # Componente reutilizável: headline de seção
│   │   └── Marquee.astro       # Faixa de texto rolante (inspiração Escuderia)
│   ├── config/
│   │   └── site.ts             # Configurações centralizadas (datas, preços, URLs, textos dinâmicos)
│   ├── styles/
│   │   └── global.css          # Reset + variáveis CSS + animações keyframe
│   └── utils/
│       └── countdown.ts        # Lógica do countdown (client-side)
└── wrangler.toml               # Config Cloudflare Pages (opcional)
```

---

## 4. DATABASE SCHEMA

Este sistema não possui banco de dados. Seção não aplicável.

---

## 5. QUEUE/JOB DEFINITIONS

Este sistema não possui filas ou jobs. Seção não aplicável.

---

## 6. IMPLEMENTATION RULES

### Regra 1: Configuração centralizada
Todos os valores dinâmicos (datas, preços, URLs, textos com placeholder) DEVEM estar em `src/config/site.ts`. Nenhum componente pode conter valores hardcoded para datas, preços ou URLs de checkout.

```typescript
// src/config/site.ts
export const SITE_CONFIG = {
  // Datas
  enrollmentDeadline: new Date("2026-05-07T23:59:59-03:00"),
  classStartDate: "7 de abril de 2026",
  classEndDate: "7 de maio de 2026",
  
  // Preços — todos os valores em centavos para evitar float
  bundlePrice: 0, // A DEFINIR — valor em centavos
  installmentCount: 12,
  installmentPrice: 0, // A DEFINIR — valor em centavos
  anchorPriceION: 0, // A DEFINIR
  anchorPriceAutomators: 0, // A DEFINIR
  anchorTotal: 0, // A DEFINIR
  
  // URLs
  checkoutURL: "https://hub.la/g/PLACEHOLDER", // Substituir pelo código real do produto Hubla
  whatsappURL: "https://wa.me/55XXXXXXXXXXX", // Número da Growth Hub
  
  // Prova social
  studentCount: "X", // Substituir pelo número real
  
  // Meta
  siteTitle: "ION + Automators Club — Turma Inaugural",
  siteDescription: "IA aplicada a processos comerciais e automação com n8n na prática. 8 semanas de calls ao vivo com a equipe Growth Hub.",
  ogImage: "/og-image.jpg",
} as const;

// Helper para formatar preço
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
```

### Regra 2: Componentes sem estado global
Cada componente Astro recebe dados via props ou importa de `site.ts`. NÃO usar stores, context, ou estado compartilhado entre componentes. A única exceção é o `Countdown.astro`, que usa `client:load` para hidratar JavaScript do contador.

### Regra 3: Animações com Intersection Observer
Animações de entrada (fade-in, slide-up) DEVEM usar CSS + Intersection Observer nativo. NÃO usar bibliotecas de animação (Framer Motion, GSAP, AOS). O pattern:

```typescript
// Em um <script> tag dentro do componente Astro
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
```

### Regra 4: Imagens otimizadas
Usar o componente `<Image>` do Astro (`astro:assets`) para todas as imagens. Formatos: WebP com fallback JPEG. Lazy loading em todas as imagens abaixo do fold. Logo SVG inline no Header.

### Regra 5: Semântica HTML
- `<header>` para navbar
- `<main>` para conteúdo
- `<section>` com `id` para cada seção (navegação por âncora)
- `<footer>` para rodapé
- `<article>` para cards de depoimentos/cases
- Headings em ordem hierárquica (h1 único no Hero, h2 para seções, h3 para sub-itens)

### Regra 6: FAQ como accordion
O FAQ DEVE ser implementado com `<details>` e `<summary>` nativos do HTML. NÃO usar JavaScript para toggle. Estilizar com Tailwind usando `open:` variant.

### Regra 7: Smooth scroll
Todos os links internos (âncoras para seções) DEVEM usar `scroll-behavior: smooth` no CSS. O header fixo requer `scroll-margin-top` em cada `<section>`.

### Regra 8: Formulário WhatsApp
O formulário da seção final coleta nome e mensagem opcional, e ao submeter redireciona para `https://wa.me/55XXXXXXXXXXX?text={mensagem_encoded}`. NÃO envia dados para nenhum backend. É 100% client-side.

### Regra 9: Responsividade
Mobile-first. Breakpoints:
- `sm`: 640px
- `md`: 768px 
- `lg`: 1024px
- `xl`: 1280px

O layout é single-column em mobile. Cards ION/Automators ficam empilhados em mobile e side-by-side a partir de `md`. O stepper da jornada é vertical em mobile e horizontal a partir de `lg`.

### Regra 10: Performance targets
- Lighthouse Performance: ≥ 95
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.0s
- Total Blocking Time: < 100ms
- Cumulative Layout Shift: < 0.05
- JavaScript total: < 15KB (apenas countdown + observer)

---

## 7. ENV VARIABLES

```bash
# ============================================
# LP ION + Automators Club — Environment
# ============================================

# Checkout
PUBLIC_CHECKOUT_URL=https://hub.la/g/PLACEHOLDER    # Código do produto Hubla
PUBLIC_WHATSAPP_NUMBER=55XXXXXXXXXXX                 # Número WhatsApp Growth Hub (sem +)

# Datas (ISO 8601 com timezone Brasil)
PUBLIC_ENROLLMENT_DEADLINE=2026-05-07T23:59:59-03:00  # Fim das inscrições / countdown
PUBLIC_CLASS_START_DATE=2026-04-07                     # Início da turma
PUBLIC_CLASS_END_DATE=2026-05-07                       # Fim das 8 semanas

# Preços (em centavos BRL)
PUBLIC_BUNDLE_PRICE=0                # Preço total do bundle — A DEFINIR
PUBLIC_INSTALLMENT_COUNT=12          # Quantidade de parcelas
PUBLIC_INSTALLMENT_PRICE=0           # Valor de cada parcela — A DEFINIR
PUBLIC_ANCHOR_ION=0                  # Preço âncora ION separado — A DEFINIR
PUBLIC_ANCHOR_AUTOMATORS=0           # Preço âncora Automators separado — A DEFINIR
PUBLIC_ANCHOR_TOTAL=0                # Soma das âncoras — A DEFINIR

# Prova social
PUBLIC_STUDENT_COUNT=X               # Número de alunos que já passaram pelos cursos

# Site
PUBLIC_SITE_URL=https://PLACEHOLDER.com   # URL final da LP — A DEFINIR
```

Todas as variáveis usam prefixo `PUBLIC_` porque são expostas no client-side (Astro convention). Nenhuma variável contém segredo — são apenas configurações de conteúdo.

---

## 8. IMPLEMENTATION ORDER

### Step 1: Setup do projeto
- Criar projeto Astro com template minimal
- Instalar Tailwind CSS 4 via integration oficial
- Configurar `tailwind.config.mjs` com tokens de design (cores, fontes, spacing)
- Configurar `astro.config.mjs` com adapter Cloudflare Pages
- Criar `src/config/site.ts` com todas as configurações
- Criar `src/styles/global.css` com variáveis CSS e animações base
- Criar `src/layouts/Layout.astro` com head, meta tags, OG, fontes

**Test**: `npm run dev` abre página em branco com fonts carregadas e fundo `#09090B`. Inspecionar head confirma meta tags e OG.

### Step 2: Header + CTAButton + estrutura da página
- Criar `Header.astro`: logo ION (SVG inline), navbar fixa com fundo blur, CTA sticky no canto
- Criar `CTAButton.astro`: componente reutilizável com variantes (primary, secondary, ghost)
- Criar `SectionHeadline.astro`: headline + sub de seção padronizados
- Criar `index.astro` importando Layout + Header + placeholder para cada seção

**Test**: Header aparece fixo no topo. CTA tem hover state. Scroll mostra backdrop-blur no header. Responsivo em mobile.

### Step 3: Hero (Seção 01)
- Badge de urgência acima da headline
- Headline principal (Opção A da copy)
- Subheadline
- CTA primário com data
- Linha de prova social abaixo do CTA

**Test**: Hero ocupa viewport completo. Badge pulsante. CTA leva para URL de checkout (placeholder). Texto responsivo.

### Step 4: Problem (Seção 02)
- Headline da seção
- Corpo de texto com espaçamento de leitura
- 3 cards de impacto visual com borda roxa

**Test**: Cards aparecem com animação fade-in ao scrollar. Layout de 3 colunas em desktop, stack em mobile.

### Step 5: Solution (Seção 03)
- Headline
- Intro de 2 linhas
- Card ION com tagline + lista de features
- Card Automators com tagline + lista de features
- Faixa de bundle abaixo dos cards

**Test**: Cards side-by-side em desktop, stacked em mobile. Faixa de bundle com destaque visual roxo.

### Step 6: Differentials + Countdown (Seção 04)
- Criar `Countdown.astro` como Astro island com `client:load`
- Lógica countdown em `src/utils/countdown.ts`
- Headline + intro
- 4 blocos de extras com ícones
- Sub-copy de urgência
- Countdown posicionado abaixo da lista de extras

**Test**: Countdown mostra DD:HH:MM:SS corretos baseado na data em env. Atualiza a cada segundo. Ao atingir zero, mostra "Inscrições encerradas".

### Step 7: Curriculum + Journey + ForWho (Seções 05, 06, 07)
- Seção 05: conteúdo incluso com lista de extras
- Seção 06: stepper visual de 4 passos (timeline vertical mobile, horizontal desktop)
- Seção 07: duas listas — "para quem é" (check icons) e "para quem não é" (x icons)

**Test**: Stepper anima sequencialmente. Listas usam ícones corretos (check verde, x vermelho). Responsivo.

### Step 8: Instructors + Cases + Testimonials (Seções 08, 09, 10) — Placeholder
- Seção 08: bio do Helio (placeholder preenchível) + grid de equipe
- Seção 09: grid de cases com estrutura Antes/Depois/Depoimento
- Seção 10: grid de depoimentos com nome + foto + texto

Todas com estrutura pronta mas conteúdo marcado como `<!-- PLACEHOLDER: Substituir com conteúdo real -->`.

**Test**: Layout correto mesmo com placeholder text. Grid responsivo. Estrutura de dados clara para preenchimento.

### Step 9: Pricing + Guarantee (Seções 11, 12)
- Seção 11: bloco âncora → reveal preço → CTA → garantia inline
- Seção 12: bloco de garantia expandido

**Test**: Valores vêm de `site.ts`. Preço formatado em BRL. CTA funcional.

### Step 10: FAQ + FinalCTA + WhatsAppForm + Footer (Seções 13, 14, 15 + Footer)
- Seção 13: FAQ accordion com `<details>/<summary>`
- Seção 14: recapitulação + countdown (segunda instância) + CTA grande
- Seção 15: formulário simples (nome + mensagem) → redirect WhatsApp
- Footer: logos + copyright + links legais

**Test**: FAQ abre/fecha sem JS. Formulário redireciona para wa.me com texto encodado. Countdown sincronizado com o da Seção 04.

### Step 11: Marquee + animações globais + polish
- Criar `Marquee.astro`: faixa de texto infinito rolante (CSS animation, sem JS)
- Implementar todas as animações de entrada via Intersection Observer
- Ajustar espaçamento, tipografia e consistência visual
- Testar scroll completo da página — fluidez e ritmo

**Test**: Marquee rola continuamente. Animações disparam uma vez ao entrar na viewport. Sem jank.

### Step 12: Performance + SEO + Deploy
- Rodar `npm run build` — verificar output estático
- Lighthouse audit — target ≥ 95 em todas as categorias
- Verificar meta tags, OG image, canonical URL
- Deploy em Cloudflare Pages via `wrangler pages deploy dist/`
- Testar em mobile real (iOS Safari + Android Chrome)

**Test**: Lighthouse ≥ 95. LCP < 2s. CLS < 0.05. Todas as meta tags presentes. Deploy funcional.

---

## 9. ANTI-PATTERNS TO AVOID

1. **DO NOT** usar Next.js, React, Vue, ou qualquer runtime JS pesado. Astro com zero JS por default.
2. **DO NOT** usar `client:load` em componentes que não precisam de interatividade. Apenas o Countdown usa hydration.
3. **DO NOT** criar API routes ou endpoints. A LP é 100% estática.
4. **DO NOT** usar bibliotecas de animação (Framer Motion, GSAP, AOS, animate.css). CSS nativo + Intersection Observer.
5. **DO NOT** usar AOS ou scroll-triggered libraries. Intersection Observer nativo.
6. **DO NOT** usar localStorage, sessionStorage, ou cookies. Não há estado persistente.
7. **DO NOT** usar formulários que enviam para backend. O formulário WhatsApp é client-side redirect.
8. **DO NOT** hardcodar datas, preços ou URLs em componentes. Tudo vem de `site.ts` ou env vars.
9. **DO NOT** usar `@import` no CSS para fontes. Usar `<link>` preconnect + preload no Layout.
10. **DO NOT** usar ícones como imagens (PNG/SVG files). Usar SVG inline ou astro-icon.
11. **DO NOT** usar jQuery ou qualquer lib legacy.
12. **DO NOT** implementar tracking/analytics a menos que explicitamente solicitado. Não há GA4, Meta Pixel, ou GTM nesta versão.
13. **DO NOT** criar área de login, cadastro, ou dashboard. A LP tem um objetivo: checkout.
14. **DO NOT** usar Tailwind `@apply` extensivamente. Preferir classes utilitárias inline.
15. **DO NOT** usar `setInterval` para o countdown. Usar `requestAnimationFrame` ou `setTimeout` recursivo com drift compensation.

---

## 10. VISUAL IDENTITY AND DESIGN SYSTEM

### Color Palette

```
PRIMARY:     #7C3AED  — [use: CTAs, botões primários, bordas de destaque, gradientes]
PRIMARY_HOVER: #6D28D9  — [use: hover state dos CTAs]
PRIMARY_LIGHT: #8B5CF6  — [use: textos roxos de destaque, ícones, badges]
PRIMARY_GLOW:  #7C3AED33  — [use: glow effect em cards e CTAs (33 = 20% opacity)]

BACKGROUND:  #09090B  — [use: fundo geral da página (zinc-950)]
SURFACE:     #18181B  — [use: cards, seções alternadas, modals (zinc-900)]
SURFACE_ALT: #27272A  — [use: hover em cards, bordas internas (zinc-800)]

TEXT:        #FAFAFA  — [use: texto principal (zinc-50)]
TEXT_MUTED:  #A1A1AA  — [use: texto secundário, labels, subtítulos (zinc-400)]
TEXT_DARK:   #71717A  — [use: texto terciário, placeholders (zinc-500)]

BORDER:      #3F3F46  — [use: bordas de cards, divisores (zinc-700)]
BORDER_LIGHT: #52525B — [use: bordas de hover (zinc-600)]

WHITE:       #FFFFFF  — [use: headlines de destaque, logo]
BLACK:       #000000  — [use: sombras]

SUCCESS:     #22C55E  — [use: ícones "para quem é", checks]
WARNING:     #EAB308  — [use: badges de urgência, countdown]
ERROR:       #EF4444  — [use: ícones "para quem não é", X marks]

GRADIENT_HERO: linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)  — [use: fundo do hero badge, detalhes]
GRADIENT_CARD: linear-gradient(180deg, #18181B 0%, #09090B 100%)  — [use: fundo de cards]
GRADIENT_CTA:  linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)  — [use: botão CTA primário]
```

### Typography

```
FONT_FAMILY_PRIMARY: "Inter", system-ui, -apple-system, sans-serif
FONT_FAMILY_DISPLAY: "Space Grotesk", "Inter", system-ui, sans-serif
FONT_FAMILY_MONO:    "JetBrains Mono", "Fira Code", monospace  — [use: código inline se necessário]

H1: 56px / 700 / 1.1  — [Space Grotesk, hero headline only]
H2: 40px / 700 / 1.2  — [Space Grotesk, section headlines]
H3: 24px / 600 / 1.3  — [Inter, sub-headlines, card titles]
H4: 20px / 600 / 1.4  — [Inter, destaque dentro de seções]
BODY: 18px / 400 / 1.7  — [Inter, texto corrido]
BODY_LARGE: 20px / 400 / 1.6  — [Inter, subheadlines, intro de seção]
SMALL: 14px / 400 / 1.5  — [Inter, captions, notas]
LABEL: 12px / 600 / 1.4 / 0.05em tracking  — [Inter, badges, tags, uppercase labels]

Mobile overrides:
H1: 36px / 700 / 1.15
H2: 28px / 700 / 1.25
BODY: 16px / 400 / 1.7
```

### Spacing and Grid

```
BASE_UNIT: 4px
SPACING: 4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px | 96px | 128px
SECTION_PADDING: 96px vertical (desktop) | 64px vertical (mobile)
BORDER_RADIUS: 8px (default) | 12px (cards) | 16px (pricing card) | 9999px (buttons, badges)
MAX_WIDTH: 1200px (content) | 800px (texto corrido)
GRID_COLUMNS: 12
GUTTER: 24px (mobile) | 32px (desktop)
```

### Component Styles

**Cards (ION, Automators, extras):**
- Background: `SURFACE` (#18181B)
- Border: 1px solid `BORDER` (#3F3F46)
- Border-radius: 12px
- Padding: 32px
- Hover: border-color transitions para `PRIMARY` (#7C3AED), box-shadow `0 0 30px PRIMARY_GLOW`
- Card ION: borda-top 2px solid `PRIMARY`
- Card Automators: borda-top 2px solid `TEXT_MUTED`

**Botão CTA Primary:**
- Background: `GRADIENT_CTA`
- Color: `WHITE`
- Font: Inter 16px/600
- Padding: 16px 32px
- Border-radius: 9999px (pill)
- Hover: scale(1.02), box-shadow `0 0 40px PRIMARY_GLOW`
- Active: scale(0.98)
- Transition: all 200ms ease-out

**Botão CTA Secondary (ghost):**
- Background: transparent
- Border: 1px solid `BORDER`
- Color: `TEXT`
- Hover: border-color `PRIMARY`, color `PRIMARY_LIGHT`

**Inputs (formulário WhatsApp):**
- Background: `SURFACE`
- Border: 1px solid `BORDER`
- Color: `TEXT`
- Padding: 12px 16px
- Border-radius: 8px
- Focus: border-color `PRIMARY`, outline `PRIMARY_GLOW`
- Placeholder: `TEXT_DARK`

**FAQ Accordion:**
- `<summary>`: font Inter 18px/600, color `TEXT`, padding 20px 0
- Marker: chevron customizado (Lucide), rotação 180deg no `open`
- Resposta: color `TEXT_MUTED`, padding-bottom 20px
- Divider: 1px solid `BORDER` entre itens

**Badge de urgência (Hero):**
- Background: `PRIMARY` com opacity 10%
- Border: 1px solid `PRIMARY`
- Color: `PRIMARY_LIGHT`
- Font: LABEL style (12px uppercase tracking)
- Padding: 6px 16px
- Border-radius: 9999px
- Animação: pulse suave (opacity 0.8 → 1)

**Countdown:**
- Números: Space Grotesk 48px/700, color `WHITE` (desktop) | 32px (mobile)
- Labels (dias, horas, min, seg): LABEL style, color `TEXT_MUTED`
- Background de cada bloco: `SURFACE`
- Border: 1px solid `BORDER`
- Border-radius: 12px
- Padding: 16px 20px
- Gap entre blocos: 12px
- Separador (":") entre blocos: `TEXT_DARK`

**Marquee (faixa rolante):**
- Background: `PRIMARY`
- Color: `WHITE`
- Font: Inter 14px/600 uppercase, letter-spacing 0.1em
- Padding: 12px 0
- Velocidade: 30s linear infinite
- Direção: right-to-left

**Stepper (Jornada):**
- Números: 32px circle, background `PRIMARY`, color `WHITE`, font Space Grotesk 700
- Linha conectora: 2px solid `BORDER`, dashed
- Título do passo: Inter 18px/600, color `TEXT`
- Descrição: Inter 16px/400, color `TEXT_MUTED`

### Animations and Transitions

```
TRANSITION_DEFAULT: 200ms ease-out   — [use: hover states, cor, borda]
TRANSITION_SLOW:    500ms ease-out   — [use: entrada de seções]
TRANSITION_SPRING:  300ms cubic-bezier(0.34, 1.56, 0.64, 1)  — [use: botões, scale effects]

FADE_IN_UP:        opacity 0→1, translateY(20px→0), 500ms ease-out
FADE_IN:           opacity 0→1, 400ms ease-out
SCALE_IN:          opacity 0→1, scale(0.95→1), 400ms ease-out
SLIDE_IN_LEFT:     opacity 0→1, translateX(-20px→0), 500ms ease-out
SLIDE_IN_RIGHT:    opacity 0→1, translateX(20px→0), 500ms ease-out
STAGGER_DELAY:     cada item 100ms após o anterior

MARQUEE:           translateX(0→-50%) linear infinite 30s
PULSE_BADGE:       opacity 0.7→1→0.7, 2s ease-in-out infinite
COUNTDOWN_FLIP:    (opcional) rotateX para troca de número

PAGE_TRANSITION:   Não aplicável (single page)
```

### Visual References

- **Grupo Escuderia** (grupoescuderia.com.br) — Inspirar: CTAs repetidos ao longo da página, faixa de marquee com texto rolante, tom dark/premium, seções com headline+corpo+CTA
- **Kyon Digital** (kyondigital.com) — Inspirar: layout moderno com cards de features, seções bem espaçadas, tipografia grande e limpa, gradientes sutis entre seções
- **Offline Club BR** (offlineclub.com.br) — Inspirar: tom de comunidade exclusiva, posicionamento premium, escassez real como elemento de conversão

### Mode

- [x] Dark only

### Screen Structure

Página única (single page) com seções sequenciais:

| Seção | ID | Propósito | Componentes Principais |
|-------|------|-----------|----------------------|
| Header | — | Navegação fixa | Logo + CTA sticky |
| 01 Hero | `#hero` | Primeira impressão + conversão imediata | Badge + Headline + Sub + CTA + Prova social |
| 02 Problema | `#problema` | Empathy + agitação | Headline + Corpo + 3 cards impacto |
| 03 Solução | `#solucao` | Apresentar ION + Automators | Card ION + Card Automators + Faixa bundle |
| 04 Diferencial | `#diferencial` | Exclusividade da turma | 4 extras + Countdown |
| 05 Conteúdo | `#conteudo` | O que está incluso | Lista de módulos + Extras |
| 06 Jornada | `#jornada` | Reduzir ansiedade pós-compra | Stepper 4 passos |
| 07 Para quem | `#para-quem` | Qualificar lead | Lista "é para" + Lista "não é para" |
| 08 Instrutores | `#instrutores` | Autoridade | Bio Helio + Grid equipe |
| 09 Cases | `#cases` | Prova de resultado | Grid Antes/Depois |
| 10 Depoimentos | `#depoimentos` | Prova social | Grid depoimentos |
| 11 Preço | `#preco` | Conversão | Âncora + Preço + CTA |
| 12 Garantia | `#garantia` | Remover risco | Bloco garantia 7 dias |
| 13 FAQ | `#faq` | Resolver objeções | Accordion 8 perguntas |
| 14 CTA Final | `#cta-final` | Última conversão | Recap + Countdown + CTA |
| 15 WhatsApp | `#contato` | Dúvidas avançadas | Formulário → WhatsApp |
| Footer | — | Encerramento | Logos + Copyright |

---

## 11. SECURITY MANIFEST — READ BEFORE WRITING ANY CODE

### SYSTEM RISK LEVEL
LOW — Landing page estática sem backend, sem banco de dados, sem autenticação, sem dados sensíveis. Único risco: injeção via formulário WhatsApp (mitigável com sanitização client-side).

### IDENTIFIED ATTACK SURFACES
- Formulário WhatsApp: input de texto do usuário usado para construir URL wa.me
- Links externos: URL de checkout Hubla
- Variáveis de ambiente expostas: todas PUBLIC_, sem segredos

### IMPERATIVE RULES

#### Inputs
- SANITIZE o campo de mensagem do formulário WhatsApp antes de construir a URL. Remover caracteres especiais que poderiam alterar a URL (newlines, tabs, caracteres de controle)
- USE `encodeURIComponent()` para encodar a mensagem na URL do WhatsApp
- VALIDATE o campo nome: máximo 100 caracteres, strip HTML tags
- NÃO permita que o formulário envie dados para nenhum endpoint — é redirect puro

#### Links Externos
- USE `rel="noopener noreferrer"` em todos os links externos
- ABRA links de checkout em `_self` (não em nova aba — manter o fluxo)
- NÃO construa URLs dinamicamente a partir de input do usuário (exceto o wa.me com sanitização)

#### Content Security
- NÃO inclua scripts de terceiros sem validação (nenhum nesta versão)
- NÃO use `innerHTML` ou `dangerouslySetInnerHTML` — todo conteúdo é estático
- NÃO inclua comentários HTML com informações de infraestrutura

#### Build e Deploy
- O `.env` contém apenas configurações públicas, mas NÃO comite — cada ambiente pode ter valores diferentes
- Adicione `.env` ao `.gitignore`
- VERIFIQUE que o build output (`dist/`) não contém source maps em produção

### PRE-DEPLOY CHECKLIST
- [ ] Nenhuma credencial no código (não há credenciais neste projeto, mas verificar)
- [ ] `.env` no `.gitignore`
- [ ] `rel="noopener noreferrer"` em links externos
- [ ] Formulário WhatsApp sanitiza input com `encodeURIComponent`
- [ ] Build estático sem source maps
- [ ] URLs de checkout apontam para Hubla real (não placeholder)
- [ ] Countdown aponta para data correta (07/05/2026 23:59 BRT)
- [ ] Meta tags e OG image corretos
- [ ] Testado em mobile real (iOS Safari + Android Chrome)
- [ ] Lighthouse ≥ 95 em Performance
