<img src="./public/logo.png" width="150" float="right" />

# Wordle Vue

[Wordle](https://www.nytimes.com/games/wordle/index.html) game implementation with Vue.js

This is my personal learning project, not claiming to be fully compliant with the rules of the original game

### Stack

- Vue 3
- Vite
- TailwindCSS
- PostCSS with Autoprefixer

### Features & ToDo

- [x] Word of the day mode
- [x] Custom word mode
- [x] Word validation with pre-defined list
- [x] Highlighting of letters according to their presence and position in the word
- [x] On-screen keyboard
- [ ] Mobile responsive
- [ ] Game settings
- [ ] Local statistics
- [x] Light/Dark themes
- [ ] Internationalization
  - [x] English
  - [ ] Русский
  - [ ] Українська
- [x] PWA
- [ ] Guide (how to play)

### Build or run local server

Make sure you have Node.js 20 or higher & pnpm 9 installed

- `pnpm install` to install/update dependencies
- `pnpm run dev` to run Vite HMR-server for development
- `pnpm run build` to build entire project with Vite. You can find build files in 'dist' folder
