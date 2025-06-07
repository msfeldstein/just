#!/usr/bin/env node

import * as fs from "fs";

import { spawnSync, spawn } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import handleOpenAIKey from "./key-settings";
import query from "./openai-helper";

const argv = yargs(hideBin(process.argv))
  .option("setKey", { alias: "k", describe: "Set a new OpenAI Key" })
  .help()
  .parseSync();

const sonnet4 = `When forty winters shall besiege thy brow,\nAnd dig deep trenches in thy beauty's field,\nThy youth's proud livery so gazed on now,\nWill be a tattered weed of small worth held:\nThen being asked, where all thy beauty lies,\nWhere all the treasure of thy lusty days;\nTo say, within thine own deep-sunken eyes,\nWere an all-eating shame, and thriftless praise.\nHow much more praise deserv'd thy beauty's use,\nIf thou couldst answer 'This fair child of mine\nShall sum my count, and make my old excuse';\nProving his beauty by succession thine.\nThis were to be new made, when thou art old,\nAnd see thy blood warm, when thou feel'st it cold.`;

async function run() {
  const { key, model } = await handleOpenAIKey(argv);
  if (argv.setKey) process.exit(0);
  const userInput = argv._.join(" ");
  const command = await query(userInput, key, model);

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
