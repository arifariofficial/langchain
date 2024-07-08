import { config } from "dotenv";
config();

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

const parser = new StringOutputParser();

const systemTemplate = `
Be very funny when answering the following questions\n
Question: {question}
`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{question}"],
]);

const chain = promptTemplate.pipe(model).pipe(parser);

const result = await chain.invoke({ question: "What is the capital of France?" });

console.log(result);
