import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

config();

const model = new ChatOpenAI({
	model: "gpt-4",
	openAIApiKey: process.env.OPENAI_API_KEY,
});

const parser = new StringOutputParser();

const systemTemplate = "Translate the following into {language}:";

const promptTemplate = ChatPromptTemplate.fromMessages([
	["system", systemTemplate],
	["user", "{text}"],
]);

// const result = await promptTemplate.invoke({ language: "italian", text: "hi" });

const chain = promptTemplate.pipe(model).pipe(parser);

const result = await chain.invoke({ language: "italian", text: "hi" });
console.log(result);
