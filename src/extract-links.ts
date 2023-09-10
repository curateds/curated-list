import { cheerio } from "../deps.ts"

export type Link = { name: string; url: string; description?: string }

export default function extractLinks(content: string) {
  const $ = cheerio.load(content)
  const listItem = $("li, h2, h3, h4")
  const all: Link[] = []
  listItem.each((_: number, element: cheerio.Element) => {
    const anchor = $(element).find("a").filter((_, anchor) => {
      const link = $(anchor).attr("href")
      return !!link && link.includes("//") && !!$(anchor).text()
    })
    if (anchor.length > 0) {
      const link = anchor.first()
      // get project name and desc.
      const description = extractDescription($(element).text())
      const item = {
        name: link.text(),
        url: link.attr("href")!,
        description: description,
      }
      all.push(item)
    }
  })
  return all
}

export function extractDescription(text: string) {
  const splited = text.split(/\s-\s(.+)?/)
  const description = splited[1]
  return description?.trim()
    .replace(/[“”]/g, "")
    .replace(/^"/, "")
    .replace(/"$/, "")
}
