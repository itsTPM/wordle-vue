<img src="./public/logo.png" width="150" float="right" />

# Wordle Vue

[Wordle](https://www.nytimes.com/games/wordle/index.html) game implementation with Vue.js

This is my personal learning project, not claiming to be fully compliant with the rules of the original game.

Found a bug or have an idea? Feel free to open an [issue](https://github.com/itsTPM/wordle-vue/issues) or [pull request](https://github.com/itsTPM/wordle-vue/pulls).

### Stack

- Vue 3
- Vite
- Pinia
- TailwindCSS
- PostCSS with Autoprefixer

### Features & ToDo

- [x] Game modes
  - [x] Word of the day mode
  - [x] Random word mode
  - [x] Custom word mode
- [x] Word validation with pre-defined list
- [x] Highlighting of letters according to their presence and position in the word
- [x] On-screen keyboard
- [x] Mobile responsive
- [x] Game settings
- [x] Local statistics
- [x] Light/Dark themes
- [ ] Internationalization
  - [x] English
  - [ ] Русский
  - [ ] Українська
- [x] PWA
- [x] Guide (how to play)

### Build or run local server

Make sure you have Node.js 20 or higher & pnpm 9 installed

- `pnpm install` to install/update dependencies
- `pnpm run dev` to run Vite HMR-server for development
- `pnpm run build` to build entire project with Vite. You can find build files in 'dist' folder
