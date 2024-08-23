import { config } from "dotenv";
config();

import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new OpenAI({ temperature: 0 });

const prompt = new PromptTemplate({
	template: "Be very funny when answering the questions\nQuestion: {question}",
	inputVariables: ["question"],
});

const chain = prompt.pipe(model);

const result = await chain.invoke({ question: "What is the capital of France?" });

console.log(result);
