import { yaml } from "../deps.ts";

const url =
  "https://raw.githubusercontent.com/trackawesomelist/trackawesomelist-source/main/config.yml";

const response = await fetch(url);
const text = await response.text();

type Sources = Record<string, { category: string | undefined }>;

const data = yaml.parse(text) as { sources: Sources };

const sources: Sources = {};

for (const [key, item] of Object.entries(data.sources)) {
  sources[key] = {
    "category": item?.category,
  };
}

const output = yaml.stringify({ sources }, { skipInvalid: true });
console.log(output);
