import Awesome from "npm:awesomelists-index";

function indexRepo(repo: string) {
  const options = {
    repo: repo,
    // token is optional parameter
    token: Deno.env.get("TOKEN") || "GITHUB_TOKEN",
  };

  // Given a repository name with author ex: vinta/awesome-python
  const awesome = new Awesome(options);
  awesome.makeIndexJson((error: Error, json: string) => console.log(error || json));
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  indexRepo("ripienaar/free-for-dev");
}
