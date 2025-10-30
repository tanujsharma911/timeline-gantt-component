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

-  **Timeline Grid:** A dynamic grid with a time scale, fully pannable.
-  **View Modes:** Switch between `Day`, `Week`, and `Month` views.
-  **Drag & Drop:** Smooth drag-and-drop for tasks to change their row or schedule time.
-  **Task Resizing:** Easily resize tasks by dragging their start or end handles.
-  **Auto-Sorting:** Tasks are automatically sorted by their start date.
-  **Zoom Controls:** Zoom in and out of the timeline for micro or macro views.

---

## 📦 Getting Started

To run the project and Storybook locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/tanujsharma911/timeline-gantt-component
   ```
2. Go into the folder

   ```
    cd timeline-gantt-component
   ```

3. Install all required dependencies:

   ```bash
   npm install
   ```

4. Run the local Storybook development server:
   ```bash
   npm run storybook
   ```
   This will open Storybook in your browser, usually at `http://localhost:6006/?path=/story/timelineview--overview`.

---

## 🏗️ Architecture

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
│   │   ├── TimelineView.stories.tsx    # For storybook
│   │   └── TimelineView.tsx            # Renders Timeline (Main/Entry Point) ---
│   │
│   └── primitives/                     # Low-level UI components (buttons, sliders, popovers, etc.)
│
├── hooks/
│   └── useDragAndDrop.ts               # Taskbar drag and drop logic
│
├── utils/
│   ├── date.utils.ts                   # Time scale generation
│   ├── position.utils.ts               # Calculates position, duration & max. no. of overlapping in row
│   └── formatting.utils.ts             # Attach tasks to rows & asign level/lanes to task
│
├── types/
│   └── timeline.types.ts                # Contains input data types
│
├── constants/
│   └── timeline.constants.ts            # Default default days pixel width
│
├── styles/
│   └── globals.css                     # Tailwind entry point for base and custom styles
│
└── stories/
    └── Timeline.stories.tsx            # Storybook demos for all scenarios

```

### 2. **State Management**

The Timeline component uses **Zustand** for efficient and modular global state management, separating concerns into two dedicated stores:

-  ** Timeline Store**  
   Responsible for managing all **rows** with **tasks**.  
   It keeps track of:

   -  `rowsWithTasks` — list of timeline rows/resources
   -  Core actions like:
      -  `setRowsWithTasks(data)`
      -  `updatedRowsWithTasks(taskId, task)`
      -  `moveTask(taskId, newRowId)`
      -  `deleteTask(taskId)`

-  ** Zoom Store**  
   Handles zoom and scaling related data for timeline visualization.  
   It maintains:

   -  `pixelPerDay` — by default set to 40 from contants file
   -  `setPixelPerDay(level)` — updates the current zoom value
   -  `increaseZoom()` — add the current zoom value by 10
   -  `decreaseZoom()` — decrease the current zoom value by 10
   -  Used to dynamically adjust column widths and date range granularity

-  **Why Two Stores?**  
   Separating timeline data and view state helps maintain **clear boundaries** between logic and presentation.  
   This modular approach ensures smoother updates, improved performance, and better scalability when adding new features like custom zoom controls or multiple timeline views.

---

### **3. Logic Handling**

- **Drag and Drop:**  
  Implemented using native HTML5 DnD events wrapped inside a custom hook (`useDragAndDrop`).  
  Handles:
  - Drag start, hover, and drop logic  
  - Task movement between rows  
  - State update through Zustand’s `moveTask` action  
  - Seamless integration with task bars for smooth interactivity  

- **Time Scale Generation:**  
  Utility functions (`generateTimeScale` and `generateMonthScale`) dynamically generate labeled columns for timeline visualization.  
  Supports:
  - **Day view**
  - **Week view** 
  - **Month view**
  - Accurate date range handling, including partial months at the boundaries  


---

### **4. Design Principles**

-  **Accessibility-First:**  
   Full keyboard navigation with just Tab and Enter, focus states, and ARIA roles.

-  **Performance Optimizations:**

   -  Virtualized rendering for large timelines
   -  Memoization of calculated scales and positions
   -  Batched updates for drag and resize interactions

-  **Responsive & Adaptive Layout:**
   -  Left & Right panels are collapsables
   -  Scales correctly across day/week/month views
   -  Mobile-friendly with horizontal scroll

---

💡 _This modular design ensures that each piece of logic (grid, drag-drop, sidebar) remains independently testable, reusable, and scalable for production environments._

---

## 📚 Storybook Stories

The included Storybook showcases the component's features in isolated scenarios.

-  **Overview:** Displays a standard timeline with a set of sample tasks.
   [View Overview](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--overview)
-  **Empty:** Renders the component in its empty state, with no tasks provided.
   [View Empty](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--empty)
-  **View Modes:** Allows toggling between `Day`, `Week`, and `Month` views to test timescale rendering.
   [View Mode](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--zoom-timeline)
-  **Mobile View:** A fully functional demo with Storybook controls to modify props and test all interactions (dragging, resizing, etc.) live.
   [View Mobile View](http://localhost:6006/?path=/story/timelineview--mobile-view)
-  **Big Data Set:** A fully functional demo with Storybook controls to modify props and test all interactions (dragging, resizing, etc.) live.
   [View Big Data](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--big-data-sets)

---

## 🛠️ Tech Stack

-  **React**
-  **TypeScript**
-  **Storybook** for component development and documentation.
-  **Tailwind CSS** for all styling.
-  **date-fns** for robust date and time logic.
-  **lucide-react** for icons.

---

## 📬 Contact

-  **Email:** hellotanujsharma@gmail.com
