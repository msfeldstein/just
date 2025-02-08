import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as readline from "readline";

const SETTINGS_PATH = path.join(os.homedir(), ".just-data");

export default async function handleAnthropicKey(argv: any) {
  if (
    argv.setKey ||
    !fs.existsSync(SETTINGS_PATH) ||
    !JSON.parse(fs.readFileSync(SETTINGS_PATH).toString()).ANTHROPIC_KEY
  ) {
    const rl = readline.promises.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const key = await rl.question("Anthropic API Key > ");
    const model = "claude-3-sonnet-20240229";
    fs.writeFileSync(
      SETTINGS_PATH,
      JSON.stringify(
        {
          MODEL: model,
          ANTHROPIC_KEY: key,
        },
        null,
        2
      )
    );
    console.log("Settings Written");
  }
  const config = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
  const key = config.ANTHROPIC_KEY;
  const model = config.MODEL ?? "claude-3-sonnet-20240229";
  return { key, model };
}
