![Neovim](https://img.shields.io/badge/NeoVim-%2357A143.svg?&style=for-the-badge&logo=neovim&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000?style=for-the-badge&logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

# md2jsx

Markdown to jsx compiler build in TypeScript and Deno runtime.

- [x] No AI
- [x] Only NeoVim
- [x] Blog: [(ata.soy)](https://www.ata.soy/blog/compiler-construction-md2jsx)

# Features

- Lexer to handle header and paragraph support
- Block and Inline lexer
- Support for **bold** and ==highlight== modifiers

# What I learned

- Inner workings of a compiler
- Moving through NeoVim
- Deno runtime and some TS tricks

# Running the code

```bash
# to try one of the example .md files
deno main.ts # it will ask for reading and writing permissions
```

# Project structure

```bash
src/
├── lexer.ts           # Block and inline scanning
├── generator.ts       # AST is used to generate .jsx output
└── main.ts            # Demo code
```
