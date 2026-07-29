
   /**
 * KNOW YOURSELF APP - Lógica Central y Gestión de Estado
 * Arquitectura: Máquina de estados modular orientada a eventos
 */

const STATE = {
  currentStep: 0,
  answers: {},
  scores: {
    disciplina: 0,
    claridad: 0,
    resiliencia: 0
  }
};

const QUIZ_METRICS = [
  {
    id: 'q1',
    category: 'disciplina',
    categoryLabel: 'Disciplina y Ejecución',
    title: 'Gestión de Fricción e Inercia Inicial',
    description: '¿Cómo respondes ante tareas de alta complejidad o falta de claridad inicial?',
    options: [
      { label: 'A', text: 'Evito el problema o postergo la ejecución esperando instrucciones detalladas.', points: 1 },
      { label: 'B', text: 'Inicio con duda, sobreanalizando opciones sin avanzar sustancialmente.', points: 3 },
      { label: 'C', text: 'Aplico descomposición táctica inmediata: divido en micro-pasos y ejecuto.', points: 5 }
    ]
  },
  {
    id: 'q2',
    category: 'disciplina',
    categoryLabel: 'Disciplina y Ejecución',
    title: 'Adherencia a Estándares y Rutinas',
    description: '¿Cuál es tu nivel de consistencia en compromisos físicos y académicos bajo fatiga?',
    options: [
      { label: 'A', text: 'Dependo completamente de la motivación o el estado de ánimo del momento.', points: 1 },
      { label: 'B', text: 'Mantengo el estándar cuando el entorno es favorable, caigo bajo estrés.', points: 3 },
      { label: 'C', text: 'Ejecución no negociable independientemente del estado emocional o cansancio.', points: 5 }
    ]
  },
  {
    id: 'q3',
    category: 'claridad',
    categoryLabel: 'Claridad y Propósito',
    title: 'Definición de Objetivos y Priorización',
    description: '¿Qué tan alineadas están tus acciones diarias con tus metas de largo plazo?',
    options: [
      { label: 'A', text: 'Modo reactivo: respondo únicamente a lo urgente e inmediato del día.', points: 1 },
      { label: 'B', text: 'Tengo metas generales, pero me distraigo con tareas secundarias.', points: 3 },
      { label: 'C', text: 'Tengo un sistema claro de prioridades y mido avance semanal de forma cuantitativa.', points: 5 }
    ]
  },
  {
    id: 'q4',
    category: 'claridad',
    categoryLabel: 'Claridad y Propósito',
    title: 'Enfoque y Eliminación de Ruido',
    description: '¿Cómo gestionas las distracciones digitales y el trabajo multidisciplinario?',
    options: [
      { label: 'A', text: 'Atención fragmentada. Salto constantemente entre redes, avisos y tareas.', points: 1 },
      { label: 'B', text: 'Intento bloques de enfoque, pero cedo frecuentemente ante notificaciones.', points: 3 },
      { label: 'C', text: 'Trabajo profundo estricto: entornos aislados de distracción en bloques de alta intensidad.', points: 5 }
    ]
  },
  {
    id: 'q5',
    category: 'resiliencia',
    categoryLabel: 'Resiliencia y Control Emocional',
    title: 'Tolerancia al Error y Retroalimentación',
    description: '¿Cuál es tu respuesta cognitiva cuando un proyecto o evaluación no sale como esperabas?',
    options: [
      { label: 'A', text: 'Locus de control externo: culpo a factores ajenos y pierdo dinamismo.', points: 1 },
      { label: 'B', text: 'Acepto la falla pero me toma días recuperar el ritmo de trabajo habitual.', points: 3 },
      { label: 'C', text: 'Análisis objetivo post-mortem: identifico la falla, ajusto la estrategia y reincido.', points: 5 }
    ]
  }
];

const StorageService = {
  SAVE_KEY: 'know_yourself_state_final',
  save(data) {
    try { localStorage.setItem(this.SAVE_KEY, JSON.stringify(data)); } 
    catch (e) { console.warn('Error al guardar en LocalStorage:', e); }
  },
  load() {
    try {
      const stored = localStorage.getItem(this.SAVE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  },
  clear() { localStorage.removeItem(this.SAVE_KEY); }
};

const AnalyticsEngine = {
  calculateScores(answers) {
    const scores = { disciplina: 0, claridad: 0, resiliencia: 0, total: 0 };
    QUIZ_METRICS.forEach(q => {
      const pts = answers[q.id] || 0;
      scores[q.category] += pts;
      scores.total += pts;
    });
    return scores;
  },
  getProfileDiagnose(totalScore) {
    if (totalScore >= 21) {
      return { level: 'ALTO RENDIMIENTO TÁCTICO', tag: 'DOMINIO COMPLETO', summary: 'Estructura cognitiva orientada a la acción. Baja fricción de inicio y alta resiliencia operacional.' };
    } else if (totalScore >= 13) {
      return { level: 'OPERATIVO EN DESARROLLO', tag: 'OPTIMIZACIÓN REQUERIDA', summary: 'Destellos de consistencia, pero sistema vulnerable ante caídas de motivación o picos de estrés.' };
    } else {
      return { level: 'ESTADO REACTIVO', tag: 'ALERTA DE SISTEMA', summary: 'Fuga severa de disciplina. Requiere un reseteo táctico de hábitos inmediato.' };
    }
  }
};

const UIRenderer = {
  init() {
    this.appEl = document.getElementById('app');
    if (!this.appEl) return;
    const saved = StorageService.load();
    if (saved && saved.completed) {
      STATE.scores = saved.scores;
      STATE.answers = saved.answers;
      this.renderResults();
    } else {
      this.renderStep();
    }
  },

  renderStep() {
    const q = QUIZ_METRICS[STATE.currentStep];
    const progress = ((STATE.currentStep + 1) / QUIZ_METRICS.length) * 100;

    this.appEl.innerHTML = `
      <div class="fade-in space-y-6">
        <div class="flex justify-between items-center text-xs font-mono mb-2 text-gray-400 border-b border-gray-800 pb-3 uppercase tracking-widest">
          <span>${q.categoryLabel}</span>
          <span>${STATE.currentStep + 1} / ${QUIZ_METRICS.length}</span>
        </div>
        
        <div class="w-full bg-gray-900 h-1 mb-8 overflow-hidden">
          <div class="bg-white h-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>

        <h2 class="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">${q.title}</h2>
        <p class="text-gray-400 text-sm mb-10 leading-relaxed font-sans">${q.description}</p>

        <div class="space-y-4">
          ${q.options.map(opt => `
            <button onclick="UIRenderer.handleAnswer('${q.id}', ${opt.points})" class="w-full text-left p-5 border border-gray-800 bg-black hover:bg-gray-900 hover:border-white transition-all duration-200 flex items-start space-x-4 group">
              <span class="font-mono text-xs px-3 py-1 border border-gray-700 text-gray-300 group-hover:border-white group-hover:text-white transition-colors">${opt.label}</span>
              <span class="text-sm text-gray-300 group-hover:text-white leading-relaxed flex-1 font-sans">${opt.text}</span>
            </button>
          `).join('')}
        </div>

        ${STATE.currentStep > 0 ? `
          <div class="mt-8 text-right">
            <button onclick="UIRenderer.prevStep()" class="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
              ← Volver
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  handleAnswer(questionId, points) {
    STATE.answers[questionId] = points;
    if (STATE.currentStep < QUIZ_METRICS.length - 1) {
      STATE.currentStep++;
      this.renderStep();
    } else {
      STATE.scores = AnalyticsEngine.calculateScores(STATE.answers);
      StorageService.save({ completed: true, scores: STATE.scores, answers: STATE.answers });
      this.renderResults();
    }
  },

  prevStep() {
    if (STATE.currentStep > 0) { STATE.currentStep--; this.renderStep(); }
  },

  renderResults() {
    const { total, disciplina, claridad, resiliencia } = STATE.scores;
    const profile = AnalyticsEngine.getProfileDiagnose(total);

    this.appEl.innerHTML = `
      <div class="fade-in space-y-10">
        <div class="border-l-4 border-white pl-6 py-2">
          <span class="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2 block">${profile.tag}</span>
          <h2 class="font-serif text-3xl md:text-4xl text-white mb-4">${profile.level}</h2>
          <p class="text-gray-400 text-sm leading-relaxed font-sans max-w-2xl">${profile.summary}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div class="p-6 border border-gray-800 bg-black">
            <span class="text-xs text-gray-500 block mb-2 uppercase tracking-widest">Disciplina</span>
            <span class="text-4xl text-white">${disciplina} <span class="text-sm text-gray-600">/ 10</span></span>
            <div class="w-full bg-gray-900 h-1 mt-6"><div class="bg-white h-full" style="width: ${(disciplina/10)*100}%"></div></div>
          </div>
          <div class="p-6 border border-gray-800 bg-black">
            <span class="text-xs text-gray-500 block mb-2 uppercase tracking-widest">Claridad</span>
            <span class="text-4xl text-white">${claridad} <span class="text-sm text-gray-600">/ 10</span></span>
            <div class="w-full bg-gray-900 h-1 mt-6"><div class="bg-white h-full" style="width: ${(claridad/10)*100}%"></div></div>
          </div>
          <div class="p-6 border border-gray-800 bg-black">
            <span class="text-xs text-gray-500 block mb-2 uppercase tracking-widest">Resiliencia</span>
            <span class="text-4xl text-white">${resiliencia} <span class="text-sm text-gray-600">/ 5</span></span>
            <div class="w-full bg-gray-900 h-1 mt-6"><div class="bg-white h-full" style="width: ${(resiliencia/5)*100}%"></div></div>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-900 flex flex-wrap gap-4 items-center justify-between font-mono">
          <button onclick="UIRenderer.reset()" class="px-6 py-3 bg-white text-black hover:bg-gray-200 text-xs transition-all tracking-widest font-bold uppercase">
            Reiniciar Diagnóstico
          </button>
          <span class="text-xs text-gray-500 tracking-widest uppercase">Puntaje Global: ${total} / 25</span>
        </div>
      </div>
    `;
  },

  reset() {
    StorageService.clear();
    STATE.currentStep = 0;
    STATE.answers = {};
    STATE.scores = { disciplina: 0, claridad: 0, resiliencia: 0, total: 0 };
    this.renderStep();
  }
};

document.addEventListener('DOMContentLoaded', () => UIRenderer.init());
