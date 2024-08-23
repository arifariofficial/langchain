import { config } from "dotenv";
config();

import { OpenAI } from "openai";

const openai = new OpenAI();

async function chat(input) {
	const message = [{ role: "user", content: input }];
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: message,
		temperature: 0,
	});

	return response.choices[0].message;
}

const question = "What is the capital of France?";

chat(question)
	.then((response) => console.log(response))
	.catch((error) => console.log(error));

const prompTemlate = `
    Be very funny when answering the questions
    Question: {question}
`;

const prompt = prompTemlate.replace("{question}", question);
