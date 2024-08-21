import "dotenv/config";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  RecursiveCharacterTextSplitter,
  CharacterTextSplitter,
} from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { similarity } from "ml-distance";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const loader = new PDFLoader("./data/MachineLearning-Lecture01.pdf");

const rawCS229Docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 128,
  chunkOverlap: 0,
});

const splitDocs = await splitter.splitDocuments(rawCS229Docs);

const embeddings = new OpenAIEmbeddings();
const vectorstore = new MemoryVectorStore(embeddings);

await vectorstore.addDocuments(splitDocs);

const retriever = vectorstore.asRetriever();

const result = await retriever.invoke("What is deep learning?");

console.log(result);
