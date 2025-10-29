# React Timeline/Gantt View Component

[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

A flexible and interactive timeline component built with React, TypeScript, and Tailwind CSS, designed for visualizing tasks, schedules, and dependencies.

This project is fully documented and viewable in Storybook.

---

## 🚀 Live Storybook

You can view and interact with all component stories and features in the deployed Storybook:

**[View Deployed Storybook](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--overview)**

---

## ✨ Features

* **Timeline Grid:** A dynamic grid with a time scale, fully pannable.
* **View Modes:** Switch between `Day`, `Week`, and `Month` views.
* **Drag & Drop:** Smooth drag-and-drop for tasks to change their row or schedule time.
* **Task Resizing:** Easily resize tasks by dragging their start or end handles.
* **Auto-Sorting:** Tasks are automatically sorted by their start date.
* **Zoom Controls:** Zoom in and out of the timeline for micro or macro views.

---

## 📦 Getting Started

To run the project and Storybook locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/tanujsharma911/timeline-gantt-component
    ```
2. Go into the folder 
   ```
    cd timeline-gantt-component
    ```

3.  Install all required dependencies:
    ```bash
    npm install
    ```

4.  Run the local Storybook development server:
    ```bash
    npm run storybook
    ```
    This will open Storybook in your browser, usually at `http://localhost:6006/?path=/story/timelineview--overview`.

---

## 🏗️ Architecture

The **Timeline Component** is designed as a modular, scalable, and performance-focused system inspired by enterprise-grade Gantt chart solutions.  
It follows a **component-driven architecture**, using **React + TypeScript + Tailwind CSS** to ensure maintainability, type safety, and responsive design.

---

### **1. Component Structure**
```
src/
│
├── components/
│   ├── Timeline/
│   │   ├── CurrentTimeLine.tsx         # Renders current vertical line indicating current date
│   │   ├── TimelineRow.tsx             # Displays individual rows with task init
│   │   ├── TaskBar.tsx                 # Individual draggable & resizable task bar
│   │   ├── RowDetailsSideBar.tsx       # Shows info about individual rows
│   │   ├── TimelineLabel.tsx           # Renders timeline dates & months labels
│   │   ├── TimelineView.types.tsx      # Contains input data types
│   │   ├── TimelineView.stories.tsx    # For storybook
│   │   └── TimelineView.tsx            # Renders Timeline (Main/Entry Point) ---
│   │
│   └── primitives/                     # Low-level UI components (buttons, sliders, popovers, etc.)
│
├── hooks/
│   └── useDragAndDrop.ts               # Taskbar drag and drop logic
│
├── utils/
│   ├── dateUtils.ts                    # Time scale generation
│   ├── position.ts                     # Task overlap and stacking calculation
│   ├── positionUtils.ts                # Pixel-position mapping based on dates
│   └── dependencyUtils.ts              # Pathfinding logic for dependency lines
│
├── types/
│   └── timelineTypes.ts                # TypeScript interfaces for TimelineTask, TimelineRow, etc.
│
├── constants/
│   └── timelineConstants.ts            # Default view modes, column widths, formats, colors
│
├── styles/
│   └── globals.css                     # Tailwind entry point for base and custom styles
│
└── stories/
    └── Timeline.stories.tsx            # Storybook demos for all scenarios

```

### **2. State Management**

- **Component State:**  
  Each task bar and timeline sub-component maintains minimal local UI state (hover, active, drag state, etc.).

- **Global Timeline Context:**  
  A React Context (`TimelineContext`) provides shared access to:
  - Tasks and rows data
  - Current view mode (`day`, `week`, `month`)
  - Start and end date boundaries
  - Event handlers (`onTaskUpdate`, `onTaskMove`, etc.)

- **Reducer Pattern (optional extension):**  
  For complex interactions (drag, resize, dependency recalculation), `useReducer` can manage immutable updates and side effects more predictably.

---

### **3. Logic Handling**

- **Drag and Drop:**  
  Implemented using native HTML5 DnD events wrapped in a custom hook (`useTimelineDragDrop`).  
  Handles:
  - Drag start and hover logic  
  - Drop target validation (by row and date)  
  - State update via callbacks (`onTaskMove`)

- **Task Dependencies:**  
  Visualized as SVG path connectors between dependent tasks, calculated dynamically based on task positions and grid layout.

- **Time Scale Generation:**  
  A utility (`generateTimeScale`) dynamically creates labeled columns for:
  - **Day view:** 1-day columns, labeled `Mon 24`
  - **Week view:** 1-week columns, labeled `Week 43`
  - **Month view:** 1-month columns, labeled `Oct 2024`

---

### **4. Design Principles**

- **Accessibility-First:**  
  Full keyboard navigation, focus states, and ARIA roles (e.g., `role="dialog"` for sidebar).

- **Performance Optimizations:**  
  - Virtualized rendering for large timelines  
  - Memoization of calculated scales and positions  
  - Batched updates for drag and resize interactions  

- **Responsive & Adaptive Layout:**  
  - Left panel fixed at 200px, right panel scrollable  
  - Scales correctly across day/week/month views  
  - Mobile-friendly with horizontal scroll gestures  

---

### **5. Storybook Scenarios**

The component is showcased via interactive Storybook stories:

1. **Default** – Basic timeline with sample tasks  
2. **Empty State** – Timeline with no tasks  
3. **With Dependencies** – Task dependency visualization  
4. **Multiple View Modes** – Day, week, and month modes  
5. **Interactive Demo** – Drag, drop, and resize behavior  
6. **Mobile View** – Responsive design preview  
7. **Accessibility** – Keyboard and ARIA demonstration  

---

💡 *This modular design ensures that each piece of logic (grid, drag-drop, dependencies, sidebar) remains independently testable, reusable, and scalable for production environments.*


---

## 📚 Storybook Stories

The included Storybook showcases the component's features in isolated scenarios.

* **Overview:** Displays a standard timeline with a set of sample tasks.
[View Overview](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--overview)
* **Empty:** Renders the component in its empty state, with no tasks provided.
[View Empty](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--empty)
* **View Modes:** Allows toggling between `Day`, `Week`, and `Month` views to test timescale rendering.
[View Mode](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--zoom-timeline)
* **Mobile View:** A fully functional demo with Storybook controls to modify props and test all interactions (dragging, resizing, etc.) live.
[View Mobile View](http://localhost:6006/?path=/story/timelineview--mobile-view)
* **Big Data Set:** A fully functional demo with Storybook controls to modify props and test all interactions (dragging, resizing, etc.) live.
[View Big Data](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--big-data-sets)

---

## 🛠️ Tech Stack

* **React**
* **TypeScript**
* **Storybook** for component development and documentation.
* **Tailwind CSS** for all styling.
* **date-fns** for robust date and time logic.
* **lucide-react** for icons.

---

## 📬 Contact

* **Email:** hellotanujsharma@gmail.com