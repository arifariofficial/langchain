import { config } from "dotenv";
config();

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4" });

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

const parser = new StringOutputParser();

// const result = await model.invoke(messages);
// const parserResult = await parser.invoke(result);

// const chain = model.pipe(parser);

// const result = await chain.invoke(messages);

const systemTemplate = "Translate the following into {language}:";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

// const result = await promptTemplate.invoke({ language: "italian", text: "hi" });

const chain = promptTemplate.pipe(model).pipe(parser);

const result = await chain.invoke({ language: "italian", text: "hi" });

console.log(result);
