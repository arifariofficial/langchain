import { config } from "dotenv";
config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chat(input) {
  const messages = [{ role: "user", content: input }];
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0,
  });

  return response.choices[0].message.content;
}

const question = "What is the capital of France?";

chat(question)
  .then((answer) => console.log(`Chatbot's answer: ${answer}`))
  .catch((error) => console.error("Error:", error));

const promptTemplate = `
Be very funny when answering the following questions:
Question: {question}
`;

const prompt = promptTemplate.replace("{question}", question);

chat(prompt)
  .then((answer) => console.log(`Chatbot's answer: ${answer}`))
  .catch((error) => console.error("Error:", error));
