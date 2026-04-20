# B2M – Back to Me 🌍

> *"Do you want to see your story in the world?"*

A cinematic AI-powered storytelling app that generates your personal life narrative based on your date of birth.

---

## 🚀 Deploy en Vercel (5 minutos, gratis)

### Paso 1 — Sube el código a GitHub

1. Ve a [github.com](https://github.com) → **New repository**
2. Nombre: `b2m-back-to-me`
3. Sube todos los archivos de esta carpeta

### Paso 2 — Conecta con Vercel

1. Ve a [vercel.com](https://vercel.com) → Sign up con GitHub (gratis)
2. Click **"Add New Project"**
3. Selecciona tu repo `b2m-back-to-me`
4. Click **Deploy** — Vercel detecta Next.js automáticamente

### Paso 3 — Agrega tu API Key de Anthropic

1. En Vercel → tu proyecto → **Settings → Environment Variables**
2. Agrega:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** tu key de [console.anthropic.com](https://console.anthropic.com)
3. Click **Save** → luego **Redeploy**

### Paso 4 — ¡Listo! 🎉

Tu app estará en: `https://b2m-back-to-me.vercel.app`

---

## 🏗️ Estructura del proyecto

```
b2m/
├── pages/
│   ├── index.js          # App principal (UI completa)
│   ├── _app.js           # Wrapper Next.js
│   └── api/
│       └── story.js      # Backend: llama a Anthropic de forma segura
├── styles/
│   └── globals.css       # Todos los estilos
├── .env.example          # Variables de entorno (copiar a .env.local)
├── next.config.js
└── package.json
```

---

## 💻 Desarrollo local

```bash
# 1. Instala dependencias
npm install

# 2. Crea tu archivo de entorno
cp .env.example .env.local
# Edita .env.local y agrega tu ANTHROPIC_API_KEY

# 3. Corre el servidor
npm run dev

# 4. Abre http://localhost:3000
```

---

## ✨ Features del MVP

- 🌍 Pantalla de bienvenida cinematográfica
- 📅 Input de fecha de nacimiento
- ⏳ Loading state animado
- 📖 Narrativa generada por IA (Claude Sonnet)
- 📊 Días vividos + identidad generacional
- 🔒 Paywall emocional
- 📱 100% mobile-first

---

## 🗺️ Próximos pasos

- [ ] Stripe para el paywall ($2.99)
- [ ] Tarjetas compartibles para Instagram
- [ ] Future self simulation
- [ ] Descargable "Life Story Report"

---

Built with Next.js + Anthropic Claude + Vercel
