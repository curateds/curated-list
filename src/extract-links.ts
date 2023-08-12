import { cheerio } from "../deps.ts"

export type Link = { name: string; url: string; description?: string }

export default function extractLinks(content: string) {
  const $ = cheerio.load(content)
  const listItem = $("li")
  const all: Link[] = []
  listItem.each((_: number, element: cheerio.Element) => {
    const link = $(element).children().attr("href")
    if (link && !link.startsWith("#")) {
      // get project name and desc.
      const splited = $(element).text().split(/\s-\s(.+)?/)
      const item = {
        name: splited[0],
        url: link,
        description: splited[1], // todo: handle if desc is empty
      }
      all.push(item)
    }
  })
  return all
}
