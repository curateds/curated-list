import { dotenv } from "../deps.ts"
import { decode, encode } from "./encoding.ts"

const apiPrefix = `https://api.github.com`

async function requireGithubToken(): Promise<string> {
  await dotenv.load({ export: true })

  const githubToken = Deno.env.get("GITHUB_TOKEN")
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not set")
  }
  return githubToken
}

export async function fetchReadMe(repo: string): Promise<string> {
  const githubToken = await requireGithubToken()
  const headerAuthorization = `token ${githubToken}`
  const headers = new Headers({
    Authorization: headerAuthorization,
    accept: "application/vnd.github.v3.html",
  })
  const url = `${apiPrefix}/repos/${repo}/readme`

  const response = await fetch(url, { headers })
  return response.text()
}

export function nameOfRepo(repo: string): string {
  return repo.replaceAll("/", "-")
}

export async function fetchReadMeWithCache(repo: string): Promise<string> {
  const name = nameOfRepo(repo)
  const dir = "cache"
  const response = await fetchReadMe(repo)

  await Deno.mkdir(dir, { recursive: true })
  await Deno.writeTextFile(`${dir}/${name}.html`, response)
  return response
}

export type Repository = {
  nameWithOwner: string
  description: string
  owner: Owner
  createdAt: string
  updatedAt: string
}

type Owner = {
  login: string
  __typename: string
  email?: string
  name?: string
}

export type QueryResult = Record<string, Repository>

export async function queryRepositories(
  repositories: Array<string>,
): Promise<QueryResult> {
  const token = await requireGithubToken()

  const str = repositories
    .map((repository) => {
      const key = encode(repository)
      const [owner, name] = repository.split("/")
      return `${key}: repository(owner: "${owner}", name: "${name}", followRenames: true) {
        ...repo
      }`
    })
    .join("\n")
  const query = `
    query {
      ${str}
    }
      
    fragment repo on Repository {
      nameWithOwner
      owner {
        login
        __typename
        ... on User {
          name
          email
          bio,
          databaseId,
          avatarUrl
        }
      }
      description
      createdAt
      pushedAt
    }`
  const url = "https://api.github.com/graphql"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({ query }),
  })
  const json = await response.json()
  if (json.errors) {
    throw new AggregateError(json.errors, "failed to query repositories")
  }
  const result: QueryResult = {}
  for (const [key, value] of Object.entries(json.data)) {
    result[decode(key)] = value as Repository
  }
  return result
}
