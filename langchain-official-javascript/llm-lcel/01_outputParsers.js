import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";

config();

const model = new ChatOpenAI({
	model: "gpt-4",
	openAIApiKey: process.env.OPENAI_API_KEY,
});

const messages = [
	new SystemMessage("Translate the following from English into Italian"),
	new HumanMessage("hi!"),
];

const result = await model.invoke(messages);

const parser = new StringOutputParser();

const parserResult = await parser.invoke(result);

console.log(parserResult);
