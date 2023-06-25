import { base64 } from "./deps.ts";

const apiPrefix = `https://api.github.com`;

export async function fetchReadMe(repo: string): Promise<string> {
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    if (!githubToken) {
      throw new Error("GITHUB_TOKEN is not set");
    }
    const headerAuthorization = `token ${githubToken}`;
    const headers = new Headers({
      Authorization: headerAuthorization,
      accept: 'application/vnd.github.v3.html',
    });
    const url = `${apiPrefix}/repos/${repo}/readme`;
    
    const response = await fetch(url, {headers})
    return response.text()
}