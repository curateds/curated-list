import { Link } from "../extract-links.ts"
import * as Github from "../github.ts"
import { backupFile, currentDate, readJson } from "../util.ts"
import { directory, synchronizeRepo } from "./update-lists.ts"
import updateSources from "./update-sources.ts"
import { equal } from "std/assert/equal.ts"

type Dict = Record<string, unknown>
interface Diff extends Github.Repository {
  items: Link[]
}

function cleanObject(obj: Dict) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  })
}

function eq(x: unknown, y: unknown) {
  if (x instanceof Object) {
    cleanObject(x as Dict)
  }
  if (y instanceof Object) {
    cleanObject(y as Dict)
  }
  return equal(x, y)
}

function objectDiff(x: Dict, y: Dict): Dict {
  const result: Dict = {}
  for (const [key, value] of Object.entries(x)) {
    if (!eq(y[key], value)) {
      result[key] = y[key]
    }
  }
  for (const [key, value] of Object.entries(y)) {
    if (!(key in x)) {
      result[key] = value
    }
  }
  return result
}

function linksAsDict(links: Link[]): Dict {
  return links.reduce((dict, link) => {
    dict[link.url] = link
    return dict
  }, {} as Dict)
}

export function linksDiff(x: Link[], y: Link[]): Link[] {
  const result: Link[] = []
  const xDict = linksAsDict(x)
  const yDict = linksAsDict(y)

  const diff = objectDiff(xDict, yDict)
  for (const [_, value] of Object.entries(diff)) {
    const link = value as Link
    result.push(link)
  }
  return result
}

async function fileDiff(x: string, y: string) {
  const [xJson, yJson] = await Promise.all([
    readJson(x),
    readJson(y),
  ])
  return objectDiff(xJson, yJson)
}

async function main() {
  const current = `data/repositories.json`
  const tmp = await Deno.makeTempDir()
  const oldFile = `${tmp}/repositories.json`
  await backupFile(current, oldFile)
  const newFile = await updateSources()
  const diff = await fileDiff(oldFile, newFile)

  const tmpListDir = `${tmp}/list`
  await Deno.mkdir(tmpListDir, { recursive: true })
  for (const [_, value] of Object.entries(diff)) {
    const repo = value as Github.Repository
    const name = Github.nameOfRepo(repo.nameWithOwner)
    const file = `${directory}/${name}.json`
    const oldFile = `${tmpListDir}/${name}.json`
    await backupFile(file, oldFile)
    const links = await synchronizeRepo(repo, directory)
    const oldLinks = await readJson(oldFile, []) as Link[]
    const linkChanges = linksDiff(oldLinks, links)
    const object = value as Diff
    object.items = linkChanges
  }

  const result = JSON.stringify(diff, null, 2)
  const path = `data/diff/${currentDate()}`
  await Deno.mkdir(path, { recursive: true })
  await Deno.writeTextFile(`${path}/changes.json`, result)
  console.log(`Diff written to directory ${path}`)
}

if (import.meta.main) {
  main()
}
