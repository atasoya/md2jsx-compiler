// glue

import { lexer } from "./lexer.ts";

// create AST (abstract syntax tree) with lexer
let ast = await lexer("example1.md");
console.log("----- Generated AST -----");
console.log(ast);
