import { cheerio } from "../deps.ts"

export type Link = { name: string; url: string; description?: string }

export default function extractLinks(content: string) {
  const $ = cheerio.load(content)
  const listItem = $("li, h2, h3, h4")
  const all: Link[] = []
  listItem.each((_: number, element: cheerio.Element) => {
    const anchor = $(element).find("a").first()
    const link = anchor.attr("href")
    if (link && link.includes("//")) {
      // get project name and desc.
      const splited = $(element).text().split(/\s-\s(.+)?/)
      const item = {
        name: anchor.text(),
        url: link,
        description: splited[1], // todo: handle if desc is empty
      }
      all.push(item)
    }
  })
  return all
}
