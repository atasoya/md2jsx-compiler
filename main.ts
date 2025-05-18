// glue

import { lexer } from "./lexer.ts";
import { generator } from "./generator.ts";
// create AST (abstract syntax tree) with lexer
let ast = await lexer("example1.md");
console.log("----- Generated AST -----");
console.log(ast);

// generate jsx
let jsx = generator(ast);
console.log(jsx);

// save it to a file
await Deno.writeTextFile("output.jsx", jsx, { encoding: "utf8" });
