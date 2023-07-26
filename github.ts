import { dotenv } from "./deps.ts";

const apiPrefix = `https://api.github.com`;

export async function fetchReadMe(repo: string): Promise<string> {
  const env = await dotenv.load();

  const githubToken = env["GITHUB_TOKEN"];
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  const headerAuthorization = `token ${githubToken}`;
  const headers = new Headers({
    Authorization: headerAuthorization,
    accept: "application/vnd.github.v3.html",
  });
  const url = `${apiPrefix}/repos/${repo}/readme`;

  const response = await fetch(url, { headers });
  return response.text();
}

export function nameOfRepo(repo: string): string {
  return repo.replaceAll("/", "-");
}

export async function fetchReadMeWithCache(repo: string): Promise<string> {
  const name = nameOfRepo(repo);
  const dir = "cache";
  const response = await fetchReadMe(repo);

  Deno.mkdirSync(dir, { recursive: true });
  Deno.writeTextFileSync(`${dir}/${name}.html`, response);
  return response;
}
