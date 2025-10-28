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
##  Live Storybook
[Your Deployed Storybook URL]
##  Installation
\`\`\`bash
npm install
npm run storybook
\`\`\`
##  Architecture
1. sweep line algo
O(n log n + n . m)
n is the number of tasks
m is the maximum number of overlaps <<
##  Features
- [x] Timeline grid with time scale
- [x] Task drag-and-drop
- [x] Task resizing
- [x] Dependencies
- [x] View mode switching
##  Storybook Stories
List your stories here
##  Technologies
- React + TypeScript
- Tailwind CSS
- Storybook
##  Contact
[Your email]