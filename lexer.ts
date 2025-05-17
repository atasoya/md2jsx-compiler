// block tokens
type token =
  | { type: "header"; level: number; content: string }
  | { type: "paragraph"; content: inline_token[] };

// inline tokens
type inline_token =
  | { type: "bold"; content: string }
  | { type: "highlight"; content: string }
  | { type: "normal"; content: string };

// modifier dict

const modifiers: { [key: string]: string } = {
  "*": "bold",
  "=": "highlight",
};

// abstract syntax tree
let ast: token[] = [];

// variables
let inline_tokens: inline_token[] = [];

// LEXER FUNCTION (file name input: string) -> Returns AST: Token[]
export async function lexer(file_path: string): token[] {
  // read the file
  const content = await Deno.readTextFile("example3.md");
  let paragraph_content = "";
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char == "#") {
      // handle titles

      // if p content is not empty create and append its token
      if (paragraph_content != "") {
        let inline_paragraph_token: inline_token = {
          type: "normal",
          content: paragraph_content,
        };
        inline_tokens.push(inline_paragraph_token);
        paragraph_content = "";
      }

      // check if inline token tree exists
      if (inline_tokens.length != 0) {
        let paragraph_token: token = {
          type: "paragraph",
          content: inline_tokens,
        };
        ast.push(paragraph_token);
        inline_tokens = [];
      }

      const header_level = get_header_level(i, content); // calculate header level eg. # ## ###
      i += header_level; // jump so we dont check # again
      const header_content_array = get_header_content(i + 1, content); // get the content of the header +1 to remove space after #
      i += header_content_array[1] - 1; // eat contents

      // create token
      var header_token: token = {
        type: "header",
        level: header_level,
        content: header_content_array[0],
      };

      ast.push(header_token); // append to the symbol table
    } else {
      // modifier detected
      if (modifiers[char] != undefined) {
        // check if normal content exisits
        if (paragraph_content != "") {
          let sub_inline_token: inline_token = {
            type: "normal",
            content: paragraph_content,
          };
          inline_tokens.push(sub_inline_token);
          paragraph_content = "";
        }
        let sub_content_data = get_sub_content(i, content, char);
        let sub_inline_token: inline_token = {
          type: modifiers[char],
          content: sub_content_data[0],
        };
        inline_tokens.push(sub_inline_token);
        i += sub_content_data[1];

        continue;
      }

      // normal text
      paragraph_content += char;
    }

    // so if not title it means it is it paragraph
    // paragraph must be until # or end of file
  }

  if (paragraph_content != "") {
    inline_tokens.push({
      type: "normal",
      content: paragraph_content,
    });
    paragraph_content = "";
  }

  if (inline_tokens.length > 0) {
    let paragraph_token: token = {
      type: "paragraph",
      content: inline_tokens,
    };
    ast.push(paragraph_token);
    inline_tokens = [];
  }

  return ast;
}

// handle sub content
function get_sub_content(
  index: number,
  content: string,
  modifier: string, // still "*"
): [string, number] {
  let sub_content = "";
  let end_index = -1;

  // skip two opening asterisks (**)
  let i = index + 2;

  for (; i < content.length - 1; i++) {
    if (content[i] == modifier && content[i + 1] == modifier) {
      end_index = i;
      break;
    }
    sub_content += content[i];
  }

  if (end_index === -1) {
    return [sub_content, sub_content.length];
  }

  return [sub_content, end_index + 2 - index]; // +2 to eat the ending **
}

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
