# KNOW YOURSELF — Plataforma de Diagnóstico Táctico v2.0

> **Fase de Código y Despliegue Final (Assignment 3)**  
> **Estudiante:** Carlos Bautista  
> **Stack:** HTML5, Tailwind CSS (Minimalista B&W), JavaScript ES6+  
> **Despliegue:** Integración Continua con Vercel Edge  

---

## 🏛️ 1. Arquitectura Algorítmica (#AlgorithmicStrategies)

El proyecto fue diseñado utilizando el patrón **State-Driven UI** en JavaScript vainilla puro. La aplicación no utiliza librerías externas de renderizado, garantizando un rendimiento óptimo de carga y evitando re-renders innecesarios.

**Flujo de Datos Estricto:**
`[LocalStorage] ◄───► [Tienda de Estado] ───► [Motor Analítico] ───► [Renderizador UI]`

### Descomposición de Módulos Lógicos:
1. **STATE (Fuente Única de Verdad):** Objeto reactivo centralizado que almacena las respuestas y la puntuación acumulada.
2. **StorageService:** Módulo con gestión defensiva de excepciones (`try/catch`) para la persistencia de datos.
3. **AnalyticsEngine:** Motor de cálculo algorítmico que clasifica los puntajes en 3 ejes: *Disciplina*, *Claridad* y *Resiliencia*.
4. **UIRenderer:** Renderizado declarativo mediante plantillas literales alineado a estética editorial minimalista.

---

## 🤖 2. Auditoría de IA y Mitigación (#ComputationalTools)

Durante el flujo de desarrollo asistido por IA, se corrigieron los siguientes fallos críticos generados por el modelo:

* **Alucinación #1 (Fuga de Idioma):** La IA generó textos de interfaz combinando inglés y español (ej. "Inercia Initial" o pies de página en inglés). Se aplicó una reestructuración de la matriz `QUIZ_METRICS` para forzar un español técnico, riguroso y uniforme en toda la plataforma.
* **Alucinación #2 (Fuga de Memoria en DOM):** La IA sugirió múltiples `addEventListener` anidados en bucles durante cada cambio de vista. Se mitigó implementando un esquema de delegación directa (`onclick`) conectada al `UIRenderer`, garantizando que la memoria permanezca limpia.

---

## 🛠️ 3. Registro de Prompts de Ingeniería

1. **Arquitectura:** *"Diseña una Single Page Application en JavaScript ES6 vanilla separando la lógica de almacenamiento local, el motor analítico y el renderizador del DOM."*
2. **Diseño Visual:** *"Crea una interfaz minimalista estricta en blanco y negro (Brutalist Minimalist) usando Tailwind CSS. Usa tipografía serif para títulos y sans-serif para lectura, eliminando bordes redondeados excesivos."*

---

## 📊 4. Autoevaluación de Rúbrica

| Criterio | Nivel | Justificación |
| :--- | :--- | :--- |
| **#AlgorithmicStrategies** | **Ejemplar (5/5)** | Código modular puro, separación de responsabilidades, analítica separada y manejo de excepciones. |
| **#ComputationalTools** | **Ejemplar (5/5)** | Repositorio estructurado, despliegue Vercel funcional y auditoría explícita de corrección de la IA documentada. |
| **#Accountability** | **Ejemplar (5/5)** | Cumplimiento estricto de entrega en tiempo y forma, reflejando iteración. |
