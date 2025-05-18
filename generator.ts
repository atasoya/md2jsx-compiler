type InlineToken =
  | { type: "normal"; content: string }
  | { type: "bold"; content: string }
  | { type: "highlight"; content: string };

type Token =
  | { type: "header"; level: number; content: string }
  | { type: "paragraph"; content: InlineToken[] };

export function generator(ast: Token[]): string {
  const jsx = ast.map((node) => {
    switch (node.type) {
      case "header":
        return `<h${node.level}>${node.content}</h${node.level}>`;

      case "paragraph":
        const inner = node.content
          .map((sub_node) => {
            switch (sub_node.type) {
              case "normal":
                return sub_node.content;
              case "bold":
                return `<strong>${sub_node.content}</strong>`;
              case "highlight":
                return `<mark>${sub_node.content}</mark>`;
            }
          })
          .join("");
        return `<p>${inner}</p>`;
    }
  });

  return `export default function Md2jsx(){
      return (${jsx.join("\n")} )}`;
}
