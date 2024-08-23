import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { config } from "dotenv";
import { AIMessage } from "@langchain/core/messages";

config();

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0,
});

const ressult = await model.invoke([
    new HumanMessage({ content: "Hi! I'm Bob" }),
    new AIMessage({ content: "Hello Bob! How can I assist you today?" }),
    new HumanMessage({ content: "What's my name?" }),
]);
console.log(ressult);
