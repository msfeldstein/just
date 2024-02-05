#!/usr/bin/env node

import * as fs from "fs";

import { spawnSync, spawn } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import handleOpenAIKey from "./key-settings.js";
import query from "./openai.js";

const argv = yargs(hideBin(process.argv))
  .option("setKey", { alias: "k", describe: "Set a new OpenAI Key" })
  .help()
  .parseSync();

async function run() {
  const key = await handleOpenAIKey(argv);
  const userInput = argv._.join(" ");
  const command = await query(userInput, key);

  if (!command) {
    console.error("Something went wrong");
    return 1;
  }

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  console.log(`> ${command} [enter to run]`);

  process.stdin.on("data", (key) => {
    if (key.toString() === "\r" || key.toString() === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.end();
      const child = spawn("sh", ["-c", `'${command}'`], {
        stdio: "inherit",
        detached: true, // This makes the child process the leader of a new process group
        shell: true,
      });
      process.on("SIGINT", () => {
        if (!child.pid) return;
        // Forward SIGINT to the entire process group by using a negative PID
        process.kill(-child.pid, "SIGINT");
      });

      child.on("close", () => {
        process.exit(0);
      });
    } else if (key) {
      // User pressed any other key, cancel execution
      console.error("Execution cancelled.");
      process.exit(1);
    }
  });
}
run();
