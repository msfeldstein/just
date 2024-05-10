import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a helpful assistant who writes mac osx terminal commands based on a users request.
Respond with only the command and nothing else.  Do not explain or wrap in code blocks.`;

export default async function query(userInput: string, key: string) {
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
    model: "gpt-3.5-turbo",
  });

  let command = completion.choices[0].message.content!;
  command = command.replace(/```bash/g, "");
  command = command.replace(/```/g, "");
  return command.trim();
}
