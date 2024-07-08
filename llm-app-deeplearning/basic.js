import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
});

const prompt = ChatPromptTemplate.fromTemplate(
  `What are three good names for a company that makes {product}?`
);

// const result = await prompt.format({
//   product: "colorful socks",
// });

// const result = await prompt.formatMessages({
//   product: "colorful socks",
// });

// const promptFromMessages = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate("You are an expert at picking company names."),
//   HumanMessagePromptTemplate.fromTemplate(
//     "What are three good names for a company that makes {product}?"
//   ),
// ]);

// const result = await promptFromMessages.formatMessages({
//   product: "shiny objects",
// });

const promptFromMessages = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert at picking company names."],
  ["human", "What are three good names for a company that makes {product}?"],
]);

const result = await promptFromMessages.formatMessages({
  product: "shiny objects",
});

console.log(result);
