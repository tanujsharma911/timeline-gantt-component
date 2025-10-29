README.md with complete documentation
package.json with all dependencies (including Storybook)
.gitignore (exclude node_modules, storybook-static)
Source code in /src following required structure
Storybook configuration in .storybook/
Component stories (.stories.tsx files)
At least 5 meaningful commits
Deployed Storybook (Chromatic/Vercel/Netlify)
NO node_modules folder

Required Stories:

1. Default - Basic timeline with sample tasks
2. Empty - Empty timeline state
3. With Dependencies - Timeline showing task dependencies
4. View Modes - Day/Week/Month view demonstrations
5. Interactive Playground - Fully functional with controls

# Timeline/Gantt View Component

## Live Storybook

[View Deployed Storybook](https://timeline-gantt-component.vercel.app/?path=/story/timelineview--overview)

## Installation

```bash
npm install
npm run storybook
```

## Architecture

## Features

-  ✅ Timeline grid with time scale
-  ✅ satisfying Task drag-and-drop on another row
-  ✅ Task resizing by drag
-  ✅ Automatic sorting by start date
-  ✅ Zoom In & Out

## Storybook Stories

-  Default — Basic timeline with sample tasks. Demonstrates typical use with multiple rows, task bars, start/end dates, and default zoom.

   -  Story: /?path=/story/timelineview--default

-  Empty — Empty timeline state. Shows empty row rendering and empty-state UI when no tasks exist.

   -  Story: /?path=/story/timelineview--empty

-  With Dependencies — Tasks with dependency links (predecessor → successor). Useful to verify dependency rendering and edge routing.

   -  Story: /?path=/story/timelineview--with-dependencies

-  View Modes — Demonstrates Day / Week / Month views and how the grid and task sizing adapt.

   -  Story: /?path=/story/timelineview--view-modes

-  Interactive Playground — Fully interactive story with Storybook Controls (args) to edit tasks, start/end dates, viewMode, zoom level, and toggle dependency editing.
   -  Story: /?path=/story/timelineview--interactive-playground
   -  Common controls:
      -  tasks (array): list of task objects { id, label, start, end, row, dependencies? }
      -  viewMode (select): day | week | month
      -  zoom (number): zoom scale
      -  allowDrag (boolean), allowResize (boolean), showDependencies (boolean)

## Technologies

-  React + TypeScript
-  Tailwind CSS
-  Storybook
-  Lucide Icons
-  Date-fns

## Contact

email: hellotanujsharma@gmail.com
