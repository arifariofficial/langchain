import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { initializeVectorstoreWithDocuments, loadAndSplitChunks } from "./lib/helpers.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableMap } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const splitDocs = await loadAndSplitChunks({
  chunkSize: 1536,
  chunkOverlap: 128,
});

const vectorstore = await initializeVectorstoreWithDocuments({
  documents: splitDocs,
});

const retriever = vectorstore.asRetriever();

const convertDocsToString = (documents) => {
  return documents
    .map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`;
    })
    .join("\n");
};

const documentRetrievalChain = RunnableSequence.from([
  (input) => input.question,
  retriever,
  convertDocsToString,
]);

// const results = await documentRetrievalChain.invoke({
//   question: "What are the prerequisites for this course?",
// });

// console.log(results);

const TEMPLATE_STRING = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be verbose!

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;

const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(TEMPLATE_STRING);

// const runnableMap = RunnableMap.from({
//   context: documentRetrievalChain,
//   question: (input) => input.question,
// });

// await runnableMap.invoke({
//   question: "What are the prerequisites for this course?",
// });

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
});

const retrievalChain = RunnableSequence.from([
  {
    context: documentRetrievalChain,
    question: (input) => input.question,
  },
  answerGenerationPrompt,
  model,
  new StringOutputParser(),
]);

const answer = await retrievalChain.invoke({
  question: "What are the prerequisites for this course?",
});

// console.log(answer);
