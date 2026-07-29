/**
 * KNOW YOURSELF APP - Core Logic & State Management
 * Architecture: Event-driven modular state machine
 */

// State Store
const STATE = {
  currentStep: 0,
  answers: {},
  scores: {
    discipline: 0,
    clarity: 0,
    resilience: 0
  },
  history: [],
  isLoading: false,
  error: null
};

// Assessment Data Matrix (Categorized Metrics)
const QUIZ_METRICS = [
  {
    id: 'q1',
    category: 'discipline',
    categoryLabel: 'Disciplina & Ejecución',
    title: 'Gestión de Fricción e Inercia Initial',
    description: '¿Cómo respondes ante tareas de alta complejidad o falta de claridad inicial?',
    options: [
      { label: 'A', text: 'Evito el problema o postergo la ejecución esperando instrucciones detalladas.', points: 1 },
      { label: 'B', text: 'Inicio con duda, sobreanalizando opciones sin avanzar sustancialmente.', points: 3 },
      { label: 'C', text: 'Aplico descomposición táctica inmediata: divido en micro-pasos y ejecuto.', points: 5 }
    ]
  },
  {
    id: 'q2',
    category: 'discipline',
    categoryLabel: 'Disciplina & Ejecución',
    title: 'Adherencia a Estándares y Rutinas',
    description: '¿Cuál es tu nivel de consistencia en compromisos físicos y académicos bajo fatiga?',
    options: [
      { label: 'A', text: 'Dependo 100% de la motivación o el estado de ánimo del momento.', points: 1 },
      { label: 'B', text: 'Mantengo el estándar cuando el entorno es favorable, caigo bajo estrés.', points: 3 },
      { label: 'C', text: 'Ejecución no negociable independientemente del estado emocional o cansancio.', points: 5 }
    ]
  },
  {
    id: 'q3',
    category: 'clarity',
    categoryLabel: 'Claridad & Propósito',
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
    category: 'clarity',
    categoryLabel: 'Claridad & Propósito',
    title: 'Foco y Eliminación de Ruido',
    description: '¿Cómo gestionas las distracciones digitales y el multitasking innecesario?',
    options: [
      { label: 'A', text: 'Atención fragmentada. Salto constantemente entre redes, avisos y tareas.', points: 1 },
      { label: 'B', text: 'Intento bloques de foco, pero cedo frecuentemente ante notificaciones.', points: 3 },
      { label: 'C', text: 'Deep Work estricto: entornos aislados de distracción en bloques de alta intensidad.', points: 5 }
    ]
  },
  {
    id: 'q5',
    category: 'resilience',
    categoryLabel: 'Resiliencia & Control Emocional',
    title: 'Tolerancia al Fracaso y Errores',
    description: '¿Cuál es tu respuesta cognitiva cuando un proyecto o evaluación sale mal?',
    options: [
      { label: 'A', text: 'Locus de control externo: culpo a factores ajenos y pierdo dinamismo.', points: 1 },
      { label: 'B', text: 'Acepto la falla pero me toma días recuperar el ritmo de trabajo habitual.', points: 3 },
      { label: 'C', text: 'Análisis objetivo post-mortem: identifico la falla, ajusto la estrategia y reincido.', points: 5 }
    ]
  }
];

// LocalStorage Manager
const StorageService = {
  SAVE_KEY: 'know_yourself_state_v2',
  
  save(data) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  load() {
    try {
      const stored = localStorage.getItem(this.SAVE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load state from LocalStorage', e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(this.SAVE_KEY);
  }
};

// Calculation & Analytics Engine
const AnalyticsEngine = {
  calculateScores(answers) {
    const scores = { discipline: 0, clarity: 0, resilience: 0, total: 0 };
    
    QUIZ_METRICS.forEach(q => {
      const selectedPoints = answers[q.id] || 0;
      scores[q.category] += selectedPoints;
      scores.total += selectedPoints;
    });

    return scores;
  },

  getProfileDiagnose(totalScore) {
    if (totalScore >= 21) {
      return {
        level: 'EJECUCIÓN ALTA (HIGH PERFORMER)',
        color: '#10B981',
        tag: 'DOMINIO TÁCTICO',
        summary: 'Muestras una estructura cognitiva orientada a la acción. Tienes baja fricción de inicio y alta resiliencia operacional.'
      };
    } else if (totalScore >= 13) {
      return {
        level: 'OPERATIVO EN DESARROLLO',
        color: '#F59E0B',
        tag: 'OPTIMIZACIÓN REQUERIDA',
        summary: 'Presentas destellos de consistencia, pero tu sistema es vulnerable ante caídas de motivación o picos de estrés.'
      };
    } else {
      return {
        level: 'ESTADO REACTIVO / COMPLACENCIA',
        color: '#EF4444',
        tag: 'ALERTA DE SISTEMA',
        summary: 'Fuga severa de disciplina e indeterminación en prioridades. Se requiere un reseteo táctico de hábitos.'
      };
    }
  }
};

// UI Rendering Engine
const UIRenderer = {
  init() {
    this.appEl = document.getElementById('app');
    if (!this.appEl) return;
    
    // Check saved state
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
    const totalQ = QUIZ_METRICS.length;
    const progress = ((STATE.currentStep + 1) / totalQ) * 100;

    this.appEl.innerHTML = `
      <div class="fade-in">
        <!-- Progress Header -->
        <div class="flex justify-between items-center text-xs font-mono mb-3 text-neutral-400 border-b border-neutral-800 pb-2">
          <span>CATEGORÍA: <strong class="text-neutral-200 uppercase">${q.categoryLabel}</strong></span>
          <span>PASO ${STATE.currentStep + 1} DE ${totalQ} (${Math.round(progress)}%)</span>
        </div>

        <div class="w-full bg-neutral-800 h-1 rounded-full mb-8 overflow-hidden">
          <div class="bg-neutral-100 h-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>

        <!-- Question Body -->
        <h2 class="text-xl md:text-2xl font-light text-white mb-2 leading-snug">${q.title}</h2>
        <p class="text-neutral-400 text-sm mb-8 leading-relaxed">${q.description}</p>

        <!-- Options list -->
        <div class="space-y-3">
          ${q.options.map(opt => `
            <button 
              onclick="UIRenderer.handleAnswer('${q.id}', ${opt.points})"
              class="w-full text-left p-4 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-150 flex items-start space-x-4 group"
            >
              <span class="font-mono text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded group-hover:border-white group-hover:text-white">${opt.label}</span>
              <span class="text-sm text-neutral-300 group-hover:text-white leading-relaxed flex-1">${opt.text}</span>
            </button>
          `).join('')}
        </div>

        ${STATE.currentStep > 0 ? `
          <div class="mt-6 text-right">
            <button onclick="UIRenderer.prevStep()" class="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors">
              ← REGRESAR A PREGUNTA ANTERIOR
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
    if (STATE.currentStep > 0) {
      STATE.currentStep--;
      this.renderStep();
    }
  },

  renderResults() {
    const scores = STATE.scores;
    const profile = AnalyticsEngine.getProfileDiagnose(scores.total);

    this.appEl.innerHTML = `
      <div class="fade-in space-y-8">
        <!-- Header diagnosis -->
        <div class="border-l-2 pl-4 py-1" style="border-color: ${profile.color}">
          <span class="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">${profile.tag}</span>
          <h2 class="text-2xl font-semibold text-white mt-2">${profile.level}</h2>
          <p class="text-neutral-400 text-sm mt-1 leading-relaxed">${profile.summary}</p>
        </div>

        <!-- Scores Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div class="p-4 rounded border border-neutral-800 bg-neutral-900/50">
            <span class="text-xs text-neutral-500 block mb-1">DISCIPLINA</span>
            <span class="text-2xl font-bold text-neutral-100">${scores.discipline} <span class="text-xs text-neutral-600">/ 10</span></span>
            <div class="w-full bg-neutral-800 h-1 mt-3 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full" style="width: ${(scores.discipline / 10) * 100}%"></div>
            </div>
          </div>

          <div class="p-4 rounded border border-neutral-800 bg-neutral-900/50">
            <span class="text-xs text-neutral-500 block mb-1">CLARIDAD</span>
            <span class="text-2xl font-bold text-neutral-100">${scores.clarity} <span class="text-xs text-neutral-600">/ 10</span></span>
            <div class="w-full bg-neutral-800 h-1 mt-3 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-full" style="width: ${(scores.clarity / 10) * 100}%"></div>
            </div>
          </div>

          <div class="p-4 rounded border border-neutral-800 bg-neutral-900/50">
            <span class="text-xs text-neutral-500 block mb-1">RESILIENCIA</span>
            <span class="text-2xl font-bold text-neutral-100">${scores.resilience} <span class="text-xs text-neutral-600">/ 5</span></span>
            <div class="w-full bg-neutral-800 h-1 mt-3 rounded-full overflow-hidden">
              <div class="bg-purple-500 h-full" style="width: ${(scores.resilience / 5) * 100}%"></div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4 border-t border-neutral-800 flex flex-wrap gap-4 items-center justify-between">
          <button 
            onclick="UIRenderer.reset()"
            class="px-5 py-2.5 rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-mono text-xs transition-all"
          >
            ↻ REINICIAR EVALUACIÓN
          </button>
          
          <span class="text-xs font-mono text-neutral-600">SCORE TOTAL: ${scores.total} / 25 PTS</span>
        </div>
      </div>
    `;
  },

  reset() {
    StorageService.clear();
    STATE.currentStep = 0;
    STATE.answers = {};
    STATE.scores = { discipline: 0, clarity: 0, resilience: 0, total: 0 };
    this.renderStep();
  }
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  UIRenderer.init();
});
