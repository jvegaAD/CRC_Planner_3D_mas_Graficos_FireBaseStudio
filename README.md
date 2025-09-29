# CRC_Planner_3D_mas_Graficos_FireBaseStudio

This project is a functional mockup of a sophisticated project control and planning tool, built as a Next.js application. It is designed to provide a rich, visual interface for managing and analyzing project timelines.

The application simulates a real-world planning environment where you can compare an initial master plan against weekly progress, identify deviations, and make informed decisions based on dynamic data visualizations.

## Key Features

*   **3D Gantt Chart View**: A unique, three-dimensional representation of the project tasks, providing a more intuitive and visually engaging way to track progress.

*   **Projected vs. Programmed Planning**:
    *   **Gantt Proyectada**: Displays the initial master plan for the entire project (100%), serving as the baseline.
    *   **Gantt Programada Semanal**: Allows for detailed weekly planning where users can update task statuses (Programado, Atrasado, Completado). This view is designed to manage and record the restrictions and realities faced each week.

*   **Comparative Analysis**: The core of the tool is its ability to visually compare the projected plan against the actual weekly programmed progress. This helps in immediately identifying delays or advances.

*   **Data-Driven Color Logic**: The Gantt chart uses a color-coding system (e.g., green for 'Programado', red for 'Atrasado', cyan for 'Completado') which is not just visual. Each color state translates into quantitative data.

*   **Dynamic Graphics for Decision Making**: The data from the Gantt chart feeds a series of interconnected graphs, such as "S-curves" and stacked bar charts. These visualizations allow for:
    *   Tracking cumulative progress vs. the projected baseline.
    *   Analyzing performance by week and by task.
    *   Deriving comparative conclusions to support strategic decision-making.

*   **AI-Powered SharePoint Helper**: Includes an assistant to generate guidance for integrating the application with SharePoint lists and data.

## Getting Started

To run the application locally, follow these steps:

1.  Install the dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) in your browser.
