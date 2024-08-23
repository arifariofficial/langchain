import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const Configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
