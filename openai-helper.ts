import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a helpful assistant who writes mac osx terminal commands based on a users request.
Respond with only the command and nothing else.  Do not explain or wrap in code blocks.`;

export default async function query(
  userInput: string,
  key: string,
  model: string
) {
  const start = performance.now();
  const openai = new OpenAI({
    apiKey: key,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: model,
  });
  console.log("Took", performance.now() - start);
  let command = completion.choices[0].message.content!;
  command = command.replace(/```bash/g, "");
  command = command.replace(/```/g, "");
  return command.trim();
}
