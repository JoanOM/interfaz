// PotroChat AI - Lógica de Interacción ChatGPT UAEMex (Verde y Oro)

document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const btnSend = document.getElementById('btnSend');
  const chatMessages = document.getElementById('chatMessages');
  const messagesContainer = document.getElementById('messagesContainer');
  const welcomeHero = document.getElementById('welcomeHero');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const suggestionCards = document.querySelectorAll('.suggestion-card');
  const historyItems = document.querySelectorAll('.history-item');
  const btnShareChat = document.getElementById('btnShareChat');

  let isGenerating = false;

  // Auto-ajuste de altura del Textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 180)}px`;

    // Activar o desactivar botón de enviar
    const hasText = chatInput.value.trim().length > 0;
    btnSend.disabled = !hasText || isGenerating;
    if (hasText && !isGenerating) {
      btnSend.classList.add('active');
    } else {
      btnSend.classList.remove('active');
    }
  });

  // Enviar con Enter (sin Shift)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!btnSend.disabled) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Manejo de envío del formulario
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message || isGenerating) return;

    // Ocultar bienvenida en el primer mensaje
    if (welcomeHero) {
      welcomeHero.style.display = 'none';
    }

    // Agregar mensaje del usuario
    appendUserMessage(message);

    // Limpiar input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    btnSend.disabled = true;
    btnSend.classList.remove('active');

    // Generar respuesta del bot simulada
    generateBotResponse(message);
  });

  // Clic en tarjetas de sugerencia
  suggestionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      if (prompt) {
        chatInput.value = prompt;
        chatInput.dispatchEvent(new Event('input'));
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Botón Nuevo Chat
  btnNewChat.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    if (welcomeHero) {
      welcomeHero.style.display = 'flex';
    }
    chatInput.value = '';
    chatInput.style.height = 'auto';
    btnSend.disabled = true;
    btnSend.classList.remove('active');
    
    // Quitar activo de historial
    historyItems.forEach(item => item.classList.remove('active'));
    chatInput.focus();
  });

  // Cambio de chat en el historial
  historyItems.forEach((item) => {
    item.addEventListener('click', () => {
      historyItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const chatTitle = item.querySelector('.history-text').textContent;
      loadChatMock(chatTitle);

      // Si está en móvil, cerrar la barra lateral al elegir
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Toggle de barra lateral
  btnToggleSidebar.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('active');
    } else {
      if (sidebar.style.display === 'none') {
        sidebar.style.display = 'flex';
      } else {
        sidebar.style.display = 'none';
      }
    }
  });

  sidebarOverlay.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  // Compartir chat
  btnShareChat.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace del chat copiado al portapapeles!');
    } else {
      alert('Enlace listo para compartir.');
    }
  });

  // Función para agregar mensaje de usuario
  function appendUserMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper user';

    wrapper.innerHTML = `
      <div class="message-body">
        <div class="message-bubble">${escapeHtml(text)}</div>
      </div>
      <div class="avatar-badge user" title="Usuario">Tú</div>
    `;

    messagesContainer.appendChild(wrapper);
    scrollToBottom();
  }

  // Función para generar respuesta del bot (simulando IA)
  function generateBotResponse(userPrompt) {
    isGenerating = true;

    // Crear burbuja del bot con indicador de escritura
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper bot';

    wrapper.innerHTML = `
      <div class="avatar-badge bot" title="PotroBot UAEMex">
        <img src="assets/escudo-uaemex.png" alt="UAEMex">
      </div>
      <div class="message-body">
        <div class="message-author">PotroBot UAEMex</div>
        <div class="message-bubble">
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(wrapper);
    scrollToBottom();

    // Obtener texto simulado según la pregunta
    const botText = getContextualResponse(userPrompt);

    // Simular retraso y efecto máquina de escribir
    setTimeout(() => {
      const bubble = wrapper.querySelector('.message-bubble');
      bubble.innerHTML = ''; // Limpiar typing indicator

      let index = 0;
      const speed = 12; // ms por carácter

      function typeWriter() {
        if (index < botText.length) {
          // Renderizado progresivo con soporte básico para saltos de línea
          const currentText = botText.substring(0, index + 1);
          bubble.innerHTML = formatMarkdown(currentText);
          index++;
          scrollToBottom();
          setTimeout(typeWriter, speed);
        } else {
          isGenerating = false;
          // Agregar botones de acción al terminar (Copiar, Me gusta)
          addMessageActions(wrapper, botText);
          btnSend.disabled = chatInput.value.trim().length === 0;
        }
      }

      typeWriter();
    }, 600);
  }

  // Acciones en la respuesta del bot (Copiar mensaje)
  function addMessageActions(wrapper, text) {
    const body = wrapper.querySelector('.message-body');
    const actions = document.createElement('div');
    actions.className = 'message-actions';

    actions.innerHTML = `
      <button class="btn-bubble-action btn-copy" title="Copiar al portapapeles">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copiar</span>
      </button>
      <button class="btn-bubble-action" title="Útil">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </button>
    `;

    const copyBtn = actions.querySelector('.btn-copy');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.querySelector('span').textContent = '¡Copiado!';
        setTimeout(() => {
          copyBtn.querySelector('span').textContent = 'Copiar';
        }, 2000);
      });
    });

    body.appendChild(actions);
  }

  // Respuestas temáticas de la UAEMex
  function getContextualResponse(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('beca') || p.includes('apoyo')) {
      return `¡Hola, Potro! Con gusto te oriento sobre las **Becas Institucionales UAEMex**:\n\n` +
             `1. **Beca de Formación Universitaria:** Orientada a estudiantes con promedio sobresaliente o situación económica vulnerable.\n` +
             `2. **Requisitos principales:**\n` +
             `   • Estar inscrito como alumno regular en el semestre activo.\n` +
             `   • Promedio mínimo general de 8.0 o 8.5 (según la modalidad).\n` +
             `   • Registrar tu solicitud en el portal de Control Escolar / Sistema de Becas.\n\n` +
             `Recuerda consultar la convocatoria vigente en la gaceta universitaria o en la página oficial institucional. *"Patria, Ciencia y Trabajo"*.`;
    }

    if (p.includes('reinscripci') || p.includes('materia') || p.includes('horario')) {
      return `Para tu proceso de **Reinscripción en la UAEMex** toma en cuenta los siguientes pasos:\n\n` +
             `• **Cita de reinscripción:** Verifica la fecha y hora designada para tu semestre en el sistema institucional.\n` +
             `• **Carga crediticia:** Debes cumplir con el rango mínimo y máximo de créditos autorizados por tu plan de estudios.\n` +
             `• **Línea de captura:** Descarga y realiza el pago antes de la fecha límite para evitar bajas temporales del sistema.\n\n` +
             `¿Deseas que preparemos un formato para solicitar una materia optativa o cambio de grupo?`;
    }

    if (p.includes('reglamento') || p.includes('extraordinario') || p.includes('evalua')) {
      return `Con base en la **Legislación y Reglamento de Estudios Profesionales de la UAEMex**:\n\n` +
             `• **Evaluaciones ordinarias:** Se promedian conforme al plan de la asignatura (parciales, proyectos y tareas).\n` +
             `• **Evaluación extraordinaria:** Podrás presentar examen extraordinario siempre y cuando cubras el porcentaje mínimo de asistencias estipulado.\n` +
             `• **Calificación mínima aprobatoria:** 6.0 (seis punto cero) en escala del 0 al 10.\n\n` +
             `Siempre puedes acudir a tu Subdirección Académica o Tutor(a) de grupo para aclarar dudas sobre actas de evaluación.`;
    }

    if (p.includes('solicitud') || p.includes('redactar') || p.includes('carta')) {
      return `Aquí tienes una plantilla base institucional para tu solicitud académica:\n\n` +
             `**Toluca, México a [Fecha]**\n\n` +
             `**AT'N: [Nombre de la Autoridad o Director(a)]**\n` +
             `Directora/Director de la [Facultad o Unidad Académica]\n` +
             `Universidad Autónoma del Estado de México\n\n` +
             `Por medio de la presente, el que suscribe **[Tu Nombre Completo]**, alumno regular de la Licenciatura en **[Carrera]** con número de cuenta **[0000000]**, me dirijo respetuosamente para solicitar: **[Expón aquí tu petición con claridad]**.\n\n` +
             `Agradeciendo de antemano su amable atención a la presente, quedo a su disposición.\n\n` +
             `*Atentamente,*\n` +
             `**"Patria, Ciencia y Trabajo"**\n\n` +
             `_____________________________\n` +
             `Firma del Alumno`;
    }

    // Respuesta genérica inteligente
    return `¡Entendido! Como asistente con la identidad institucional **Verde y Oro** de la **UAEMex**, estoy aquí para apoyarte en tus actividades académicas, proyectos y consultas universitarias.\n\n` +
           `Sobre lo que me comentas: *" ${prompt} "*\n\n` +
           `Puedes personalizar este componente o conectarlo a una API backend como **Gemini API**, **OpenAI** o un modelo local (vLLM / Ollama). ¿Te gustaría que agreguemos alguna función específica a esta plantilla?`;
  }

  // Carga mock al seleccionar historial
  function loadChatMock(title) {
    if (welcomeHero) welcomeHero.style.display = 'none';
    messagesContainer.innerHTML = '';

    appendUserMessage(`Consulta sobre: ${title}`);

    setTimeout(() => {
      const mockResponse = `Aquí tienes el registro archivado correspondiente a: **${title}**.\n\n` +
                           `Puedes continuar haciendo preguntas o iniciar una nueva conversación con el botón **+ Nuevo chat**.`;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'message-wrapper bot';
      wrapper.innerHTML = `
        <div class="avatar-badge bot" title="PotroBot UAEMex">
          <img src="assets/escudo-uaemex.png" alt="UAEMex">
        </div>
        <div class="message-body">
          <div class="message-author">PotroBot UAEMex</div>
          <div class="message-bubble">${formatMarkdown(mockResponse)}</div>
        </div>
      `;
      messagesContainer.appendChild(wrapper);
      addMessageActions(wrapper, mockResponse);
      scrollToBottom();
    }, 200);
  }

  // Scroll automático hacia abajo
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Sanitizar HTML simple
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Parseo ligero de Markdown para texto con negritas, listas y cursivas
  function formatMarkdown(text) {
    let formatted = escapeHtml(text);

    // Negritas **texto**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Cursivas *texto*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Saltos de línea
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }
});
