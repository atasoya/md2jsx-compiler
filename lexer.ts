// block tokens
type token =
  | { type: "header"; level: number; content: string }
  | { type: "paragraph"; content: string };

// abstract syntax tree
let ast: token[] = [];

// read the file
const content = await Deno.readTextFile("example2.md");
let paragraph_content = "";
for (let i = 0; i < content.length; i++) {
  const char = content[i];
  console.log("-------");
  console.log("reading char: ", char, "at index ", i);
  if (char == "#") {
    // handle titles
    console.log("header detected");

    // if p content is not empty create and append its token
    if (paragraph_content != "") {
      let paragraph_token: token = {
        type: "paragraph",
        content: paragraph_content,
      };
      ast.push(paragraph_token);
      paragraph_content = "";
    }

    const header_level = get_header_level(i, content); // calculate header level eg. # ## ###
    console.log("level of header is:", header_level);
    i += header_level; // jump so we dont check # again
    const header_content_array = get_header_content(i + 1, content); // get the content of the header +1 to remove space after #
    console.log("content of header:", header_content_array[0]);
    i += header_content_array[1] - 1; // eat contents

    // create token
    var header_token: token = {
      type: "header",
      level: header_level,
      content: header_content_array[0],
    };

    ast.push(header_token); // append to the symbol table
  } else {
    paragraph_content += char;
  }

  // so if not title it means it is it paragraph
  // paragpraph must be until # or end of file
  console.log("----");
}

if (paragraph_content != "") {
  let paragraph_token: token = {
    type: "paragraph",
    content: paragraph_content,
  };
  ast.push(paragraph_token);
}

console.log(ast);

// get header level
function get_header_level(index: number, content: string): number {
  if (peek(index, content) != "#") {
    return 1;
  }
  return get_header_level(index + 1, content) + 1;
}

// get header content (before new line)
function get_header_content(index: number, content: string): [string, number] {
  let header_content = "";
  let header_content_index = 0;
  for (let i = index; i < content.length; i++) {
    if (content[i] == "\n") {
      header_content = content.slice(index, i);
      header_content_index = i - index + 1;
      break;
    }
  }
  return [header_content, header_content_index];
}

// peek ahead
function peek(index: number, content: string): string {
  return content[index + 1];
}
