const questions = [
  {
    id: 1,
    question: "¿Cómo reaccionas ante un bloqueo o falta de claridad en tus tareas diarias?",
    options: [
      { text: "Me detengo, busco excusas o espero a que alguien más lo resuelva por mí.", points: 0 },
      { text: "Lo pospongo un rato intentando investigar, pero caigo en parálisis por análisis.", points: 5 },
      { text: "Tomo acción inmediata: desgloso el problema en pasos tácticos y ejecuto de una.", points: 10 }
    ]
  },
  {
    id: 2,
    question: "¿Qué nivel de rigor aplicas a tus disciplinas físicas y de entrenamiento semanal?",
    options: [
      { text: "Inconsistente. Voy solo cuando tengo motivación o tiempo libre.", points: 0 },
      { text: "Cumplo la mayoría de días, pero fallo cuando hay cansancio o presión.", points: 5 },
      { text: "Inquebrantable. El plan se ejecuta sin importar el estado de ánimo.", points: 10 }
    ]
  },
  {
    id: 3,
    question: "¿Cuál es tu enfoque al medir resultados académicos o profesionales?",
    options: [
      { text: "Me conformo con lo mínimo indispensable para pasar o cumplir.", points: 0 },
      { text: "Busco destacar, pero a veces me distraigo con proyectos secundarios.", points: 5 },
      { text: "Enfoque obsesivo en el estándar máximo de competencia y dominación del tema.", points: 10 }
    ]
  }
];

let currentQuestion = 0;
let score = 0;

const appContainer = document.getElementById('app');

function renderQuestion() {
  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  appContainer.innerHTML = `
    <div class="mb-6">
      <div class="flex justify-between text-xs text-slate-400 mb-2 font-semibold">
        <span>PREGUNTA ${currentQuestion + 1} DE ${questions.length}</span>
        <span>${Math.round(progress)}% COMPLETADO</span>
      </div>
      <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${progress}%"></div>
      </div>
    </div>

    <h3 class="text-xl font-bold text-white mb-6">${q.question}</h3>

    <div class="space-y-3">
      ${q.options.map((opt, idx) => `
        <button 
          onclick="selectOption(${opt.points})"
          class="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all duration-200 text-slate-300 font-medium flex items-center justify-between group"
        >
          <span>${opt.text}</span>
          <span class="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
        </button>
      `).join('')}
    </div>
  `;
}

function selectOption(points) {
  score += points;
  currentQuestion++;

  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    renderResults();
  }
}

function renderResults() {
  let title = "";
  let badgeClass = "";
  let desc = "";

  if (score >= 25) {
    title = "Estatus: Nivel God (Dominio Aion)";
    badgeClass = "bg-amber-500/20 text-amber-400 border-amber-500/50";
    desc = "Tienes una Mentalidad de Ejecución Directa. Tu capacidad para eliminar el ruido y centrarte en la acción es tu activo más valioso.";
  } else if (score >= 15) {
    title = "Estatus: En Desarrollo / Operativo";
    badgeClass = "bg-blue-500/20 text-blue-400 border-blue-500/50";
    desc = "Tienes buena base de competencia, pero aún permites fugas de disciplina o parálisis por análisis en momentos clave.";
  } else {
    title = "Estatus: Espectador";
    badgeClass = "bg-red-500/20 text-red-400 border-red-500/50";
    desc = "Nivel crítico de complacencia. Necesitas reestructurar de inmediato tus hábitos y tomar control táctico de tus acciones.";
  }

  appContainer.innerHTML = `
    <div class="text-center py-6">
      <div class="inline-block px-4 py-1.5 rounded-full border ${badgeClass} text-xs font-bold uppercase mb-4 tracking-widest">
        ${title}
      </div>
      <h2 class="text-3xl font-extrabold text-white mb-2">Puntaje Final: ${score} / 30</h2>
      <p class="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        ${desc}
      </p>

      <button 
        onclick="resetQuiz()"
        class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/10"
      >
        Reiniciar Evaluación
      </button>
    </div>
  `;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
}

// Inicializar
renderQuestion();
