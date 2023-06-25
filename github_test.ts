import { assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import * as Github from "./github.ts";

Deno.test(async function fetchReadMe() {
  const repo = "vinta/awesome-python";
  const response = await Github.fetchReadMeWithCache(repo);
  assert(
    response.indexOf("<article") > 0,
    "the response should contains html <article> tag.",
  );
});
