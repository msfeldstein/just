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
    const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"];
    const model = await rl.question(`GPT Model ${JSON.stringify(models)} > `);
    if (!models.includes(model)) throw "Not a valid model: " + model;
    fs.writeFileSync(
      SETTINGS_PATH,
      JSON.stringify(
        {
          MODEL: model,
          OPENAI_KEY: key,
        },
        null,
        2
      )
    );
    console.log("Settings Written");
  }
  const config = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
  const key = config.OPENAI_KEY;
  const model = config.MODEL ?? "gpt-4";
  return { key, model };
}
