import { expect, test } from "vitest";
import { type Keyword } from "./keywordsGraph";
import keywordsToml from "./keywords.toml";
import keywordsTxt from "@/assets/keywords.txt?raw";

test("exact 101 keywords", () => {
  const data = keywordsToml as Keyword.Data;
  const items = data.keywords.reduce(
    (acc, curr) =>
      [...acc, curr.name, ...curr.items].filter(Boolean) as string[],
    [] as string[]
  );
  expect(new Set(items).size).toBe(101);
  expect(items.join("\n")).toBe(keywordsTxt);
});
