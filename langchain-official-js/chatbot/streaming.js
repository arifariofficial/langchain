import { ChatOpenAI } from "@langchain/openai";
import { config as dotConfig } from "dotenv";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { AIMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";

dotConfig();

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0,
});

const messageHistories = {};

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a helpful assistant who remembers all details the user shares with you.`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
]);

const filterMessages = ({ chat_history }) => {
    return chat_history.slice(-10);
};

const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
        chat_history: filterMessages,
    }),
    prompt,
    model,
]);

const messages = [
    new HumanMessage({ content: "hi! I'm bob" }),
    new AIMessage({ content: "hi!" }),
    new HumanMessage({ content: "I like vanilla ice cream" }),
    new AIMessage({ content: "nice" }),
    new HumanMessage({ content: "whats 2 + 2" }),
    new AIMessage({ content: "4" }),
    new HumanMessage({ content: "thanks" }),
    new AIMessage({ content: "No problem!" }),
    new HumanMessage({ content: "having fun?" }),
    new AIMessage({ content: "yes!" }),
    new HumanMessage({ content: "That's great!" }),
    new AIMessage({ content: "yes it is!" }),
];

const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) => {
        if (messageHistories[sessionId] === undefined) {
            const messageHistory = new InMemoryChatMessageHistory();
            await messageHistory.addMessages(messages);
            messageHistories[sessionId] = messageHistory;
        }
        return messageHistories[sessionId];
    },
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
});

const config = {
    configurable: {
        sessionId: "abc6",
    },
};

const stream = await withMessageHistory.stream(
    {
        input: "hi! I'm todd. tell me a joke",
    },
    config
);

for await (const chunk of stream) {
    console.log("|", chunk.content);
}
