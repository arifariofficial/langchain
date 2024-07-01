import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

config();

// Load documents from the web
const loader = new CheerioWebBaseLoader("https://docs.smith.langchain.com/user_guide");
const rawDocs = await loader.load();

// Split documents into smaller chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const docs = await splitter.splitDocuments(rawDocs);

// Create a memory vector store from the documents
const vectorstore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
const retriever = vectorstore.asRetriever();

// Invoke the retriever with a query
const retrieverResult = await retriever.invoke("how to upload a dataset");
console.log(retrieverResult[0]);

/*
    Document {
      pageContent: "your application progresses through the beta testing phase, it's essential to continue collecting data to refine and improve its performance. LangSmith enables you to add runs as examples to datasets (from both the project page and within an annotation queue), expanding your test coverage on real-world scenarios. This is a key benefit in having your logging system and your evaluation/testing system in the same platform.Production​Closely inspecting key data points, growing benchmarking datasets, annotating traces, and drilling down into important data in trace view are workflows you’ll also want to do once your app hits production. However, especially at the production stage, it’s crucial to get a high-level overview of application performance with respect to latency, cost, and feedback scores. This ensures that it's delivering desirable results at scale.Monitoring and A/B Testing​LangSmith provides monitoring charts that allow you to track key metrics over time. You can expand to",
      metadata: {
        source: 'https://docs.smith.langchain.com/user_guide',
        loc: { lines: [Object] }
      }
    }
  */

// Create a retriever tool
const retrieverTool = createRetrieverTool(retriever, {
    name: "langsmith_search",
    description:
        "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
});

const tools = [retrieverTool];

// Initialize OpenAI LLM
const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0,
});

// Get the prompt to use - await the pull function
const prompt = await pull("hwchase17/openai-functions-agent");

// Create OpenAI Functions Agent
const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
});

// Initialize Agent Executor
const agentExecutor = new AgentExecutor({
    agent,
    tools,
});
