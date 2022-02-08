import toml from "rstoml";
import path from "node:path";
import fs from "node:fs/promises";
import { type Keyword } from "../src/graph/keywordsGraph";

async function main() {
  const raw = await fs.readFile(
    path.join(__dirname, "../src/graph/keywords.toml"),
    "utf-8"
  );
  const data = toml.parse(raw) as Keyword.Data;
  const keywords = data.keywords.flatMap((k) =>
    [k.name ?? null, ...k.items].filter(Boolean)
  );
  await fs.writeFile(
    path.join(__dirname, "../src/assets/keywords.txt"),
    keywords.join("\n")
  );
}

main();
