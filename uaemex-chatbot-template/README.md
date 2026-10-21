# 🟢🟡 Plantilla de Chatbot Estilo ChatGPT - UAEMex (Verde y Oro)

Plantilla web moderna, responsiva e interactiva inspirada en la interfaz de **ChatGPT**, personalizada con la identidad institucional, colores oficiales (**Verde y Oro**) y el escudo de la **Universidad Autónoma del Estado de México (UAEMex)**.

---

## 🎨 Paleta Institucional (Verde y Oro)

| Elemento | Código HEX | Descripción |
| :--- | :--- | :--- |
| **Oro Principal** | `#D4AF37` | Acentos, botones activos, insignias y bordes destacados |
| **Oro Claro / Hover** | `#F3CA40` | Hover en botones e iconos iluminados |
| **Verde Institucional Oscuro** | `#0C2018` | Fondos de superficie y ambientación |
| **Verde Superficie / Tarjetas** | `#0F241C` | Contenedores de tarjetas, mensajes y barra de búsqueda |
| **Verde Esmeralda Profundo** | `#1A4232` | Burbujas de mensajes del usuario |
| **Fondo Base** | `#0A1712` | Dark mode institucional de alto contraste |

---

## 🚀 Características Incluidas

- **Diseño estilo ChatGPT:**
  - Barra lateral (*Sidebar*) con historial de chats, botón **"+ Nuevo chat"** y perfil de alumno.
  - Barra superior (*Navbar*) con selector de modelo (`PotroBot v2.5 Verde y Oro`) y botón para compartir.
  - Pantalla de inicio con el escudo oficial de la UAEMex, lema *"Patria, Ciencia y Trabajo"* y tarjetas de sugerencias interactivas.
  - Burbujas de mensajes diferenciadas con avatares institucionales y botón para **copiar respuesta**.
  - Barra inferior con *auto-resize* de campo de texto y botón dinámico que se ilumina en dorado al escribir.
- **Efecto Máquina de Escribir:** Simulación de generación de respuestas de IA en tiempo real con indicador de escritura (*typing dots*).
- **100% Responsivo:** Menú colapsable con soporte completo para teléfonos móviles y pantallas de escritorio.
- **Sin Dependencias Pesadas:** Funciona directamente abriendo `index.html` en cualquier navegador (HTML5, CSS3 y JavaScript nativo).

---

## 📂 Estructura de Archivos

```text
uaemex-chatbot-template/
├── assets/
│   └── escudo-uaemex.png    # Escudo oficial de la UAEMex
├── index.html               # Estructura semántica del chatbot
├── styles.css               # Estilos y variables con colores Verde y Oro
├── app.js                   # Lógica de chat, respuestas y animaciones
└── README.md                # Guía de uso y comandos Git
```

---

## 🛠️ Cómo Probar la Plantilla Localmente

Tienes varias opciones sencillas:

1. **Doble Clic:** Abre el archivo `index.html` en Chrome, Edge, Firefox o tu navegador preferido.
2. **Con Python:**
   ```bash
   python -m http.server 8000
   ```
   Abre en tu navegador `http://localhost:8000`.
3. **Con VS Code:** Instala la extensión **Live Server** y haz clic en *"Go Live"*.

---

## 🌿 Paso a Paso: Cómo Subir tu Plantilla a tu Propia Rama en Git

Sigue estos comandos en tu terminal desde la raíz del proyecto para crear tu rama y publicar tus cambios:

### 1. Asegúrate de tener el repositorio actualizado
```bash
git checkout main
git pull origin main
```

### 2. Crea y cámbiate a tu propia rama (sustituye con tu nombre o matrícula)
```bash
git checkout -b feature/chatbot-juan-perez
# Ejemplo alternativo:
# git checkout -b rama-chatbot-uaemex
```

### 3. Agrega todos los archivos al seguimiento de Git
```bash
git add .
```

### 4. Realiza tu commit con un mensaje descriptivo
```bash
git commit -m "feat: plantilla de chatbot estilo chatgpt con colores verde y oro uaemex"
```

### 5. Sube tu rama al repositorio remoto (GitHub, GitLab, etc.)
```bash
git push -u origin feature/chatbot-juan-perez
```

---

## 💡 Cómo Conectar una API Real (Opcional)

En el archivo `app.js`, en la función `generateBotResponse()`, puedes reemplazar `getContextualResponse(userPrompt)` por una llamada a tu backend (`fetch('/api/chat', ...)`):

```javascript
// Ejemplo con Fetch a un backend con Gemini / OpenAI:
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userPrompt })
});
const data = await response.json();
const botText = data.reply;
```
