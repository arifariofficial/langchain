import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
});

const prompt = ChatPromptTemplate.fromTemplate(
  `What are three good names for a company that makes {product}?`
);

// const chain = prompt.pipe(model);
// const result = await chain.invoke({
//   product: "colorful socks",
// });

const outputParser = new StringOutputParser();

// const nameGenerationChain = prompt.pipe(model).pipe(outputParser);

const nameGenerationChain = RunnableSequence.from([prompt, model, outputParser]);

// const result = await nameGenerationChain.invoke({
//   product: "fancy cookies",
// });

// console.log(result);

const stream = await nameGenerationChain.stream({
  product: "really cool robots",
});

// for await (const chunk of stream) {
//   console.log(chunk);
// }

const inputs = [{ product: "large calculators" }, { product: "alpaca wool sweaters" }];

const result = await nameGenerationChain.batch(inputs);

console.log(result);
