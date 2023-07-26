## Introduction

Crawl awesome lists on Github, and save it as json files.

## Usage

1. Get a Github token.
2. Run the main file: `GITHUB_TOKEN=$GH_TOKEN deno run -A main.ts`

## Git commit hook

```bash
npx husky install
npx husky add .husky/pre-commit "deno fmt --check"
git add .husky/pre-commit
```
