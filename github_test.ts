import { assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import * as Github from "./github.ts";

Deno.test(async function fetchReadMe() {
  const response = await Github.fetchReadMe("vinta/awesome-python");
  // console.log(response.substring(0, 100));
  assert(
    response.indexOf("<article") > 0,
    "the response should contains html <article> tag.",
  );
});
