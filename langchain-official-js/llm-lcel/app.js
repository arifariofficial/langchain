import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

config();

const model = new ChatOpenAI({
    model: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!"),
];

// const result = await model.invoke(messages);
// // console.log(result);

const parser = new StringOutputParser();

// const parserResult = await parser.invoke(result);
// console.log(parserResult);

const chain = model.pipe(parser);
const chainResult = await chain.invoke(messages);
console.log(chainResult);
