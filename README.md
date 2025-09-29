# CRC_Planner_3D_mas_Graficos_FireBaseStudio

## Resumen del Proyecto

Este proyecto es una maqueta funcional de una sofisticada herramienta de control y planificación de proyectos, construida como una aplicación Next.js. Está diseñada para mejorar la productividad y la toma de decisiones en la gestión de obras, a través de una rica interfaz visual para analizar y comparar cronogramas.

La aplicación simula un entorno de planificación del mundo real donde los gestores pueden contrastar un plan maestro inicial contra el progreso semanal real, identificar desviaciones cuantitativas y cualitativas, y tomar decisiones informadas basadas en visualizaciones de datos dinámicas.

## Flujo de Trabajo y Enfoque en Productividad

El propósito de la herramienta es cerrar el ciclo de la planificación y ejecución, transformando datos visuales en inteligencia accionable. El flujo está diseñado para maximizar la productividad a través del control continuo:

1.  **Definición de la Línea Base (Plan Proyectado):** El proyecto comienza con la carga de una "Carta Gantt Proyectada", que representa el plan maestro ideal para el 100% de la obra. Esta es la hoja de ruta estratégica.

2.  **Ejecución y Control Semanal (Plan Programado):** Semana a semana, el equipo de terreno actualiza la "Carta Gantt Programada". Aquí es donde la realidad operativa se registra:
    *   Las tareas se marcan como **Programado**, **Atrasado** o **Completado**.
    *   Esta vista es crucial para documentar las **restricciones** y los impedimentos que afectan el cumplimiento del plan proyectado.

3.  **Análisis Comparativo Visual:** El núcleo de la herramienta es su capacidad para superponer y comparar visualmente el plan proyectado contra el progreso semanal programado. Esto permite identificar de inmediato retrasos, adelantos y su magnitud.

4.  **Insights a través de Datos (Gráficos Dinámicos):** La lógica de colores de la Gantt no es solo estética; cada estado (color) se traduce en un valor cuantitativo que alimenta una serie de gráficos interconectados. Las "Curvas-S" y los gráficos de barras permiten:
    *   Medir el **% de avance acumulado real** vs. el proyectado.
    *   Analizar el **rendimiento por semana y por tarea**, cuantificando el impacto de las restricciones.
    *   Derivar **conclusiones comparativas** para entender *por qué* ocurrieron las desviaciones.

5.  **Toma de Decisiones Informada:** Con esta inteligencia visual y cuantitativa, los líderes del proyecto pueden tomar decisiones estratégicas para corregir el rumbo, reasignar recursos, anticipar futuros cuellos de botella y, en última instancia, mejorar la productividad de las semanas siguientes.

## Características Técnicas Clave

*   **Vista de Gantt 3D**: Una representación tridimensional única de las tareas del proyecto, que proporciona una forma más intuitiva y visualmente atractiva de seguir el progreso. El efecto de profundidad y sombreado simula bloques físicos, facilitando la interpretación del cronograma.

*   **Planificación Comparativa (Proyectada vs. Programada)**:
    *   **Gantt Proyectada**: Muestra el plan maestro inicial para todo el proyecto (100%), sirviendo como la línea base inmutable.
    *   **Gantt Programada Semanal**: Permite una planificación detallada donde los usuarios actualizan los estados de las tareas. Esta vista está diseñada para gestionar y registrar las restricciones y realidades enfrentadas cada semana.

*   **Lógica de Datos por Color**: El gráfico de Gantt utiliza un sistema de codificación por colores (verde para 'Programado', rojo para 'Atrasado', cian para 'Completado') que no es solo visual. Cada estado de color se traduce en datos cuantitativos que alimentan los gráficos.

*   **Gráficos Dinámicos para Toma de Decisiones**: Los datos del Gantt alimentan una serie de gráficos interconectados, como "Curvas-S" y gráficos de barras apiladas. Estas visualizaciones son cruciales para:
    *   Seguir el progreso acumulado vs. la línea base proyectada.
    *   Analizar el rendimiento por semana y por tarea.
    *   Derivar conclusiones comparativas para apoyar la toma de decisiones estratégicas.

*   **Asistente de IA para SharePoint**: Incluye un asistente para generar orientación sobre cómo integrar la aplicación con listas y datos de SharePoint, facilitando la conexión con los sistemas existentes de la empresa.

## Stack Tecnológico

*   **Framework**: Next.js (con App Router y Server Components)
*   **Lenguaje**: TypeScript
*   **UI**: React, ShadCN UI
*   **Estilos**: Tailwind CSS
*   **Gráficos**: Recharts
*   **Funcionalidad IA**: Genkit (Google AI)

## Primeros Pasos

Para ejecutar la aplicación localmente, sigue estos pasos:

1.  Instala las dependencias:
    ```bash
    npm install
    ```

2.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```

3.  Abre [http://localhost:9002](http://localhost:9002) en tu navegador.
