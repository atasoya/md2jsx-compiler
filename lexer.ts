// block tokens 
type token =
    | {"type":"header","level":number,"content":string}
    | {"type":"paragraph","content":string};


// read the file
const content = await Deno.readTextFile("example1.md");
console.log("File contents:\n", content);
for(const char of content){
    console.log(char)
}
