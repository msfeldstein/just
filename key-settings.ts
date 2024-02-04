import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as readline from "readline";

const SETTINGS_PATH = path.join(os.homedir(), ".just-data");

export default async function handleOpenAIKey(argv: any) {
  if (
    argv.setKey ||
    !fs.existsSync(SETTINGS_PATH) ||
    !JSON.parse(fs.readFileSync(SETTINGS_PATH).toString()).OPENAI_KEY
  ) {
    const rl = readline.promises.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const key = await rl.question("OpenAI Key > ");
    fs.writeFileSync(
      SETTINGS_PATH,
      JSON.stringify(
        {
          OPENAI_KEY: key,
        },
        null,
        2
      )
    );
    console.log("Setttings Written");
  }
  const config = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
  const key = config.OPENAI_KEY;
  return key;
}
