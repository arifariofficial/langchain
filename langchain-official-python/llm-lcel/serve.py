#!/usr/bin/env python
from typing import List

from fastapi import FastAPI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langserve import add_routes

# Create prompt template
system_template = "Translate the following into {language}:"
prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", system_template),
        ("user", "{text}"),
    ]
)

# Create model
model = ChatOpenAI()

# Create output parser
parser = StrOutputParser()

# Create chain
chian = prompt_template | model | parser

# App defination
app = FastAPI(
    title="Langchain Server",
    version="1.0",
    description="A simple API server using LangChain's Runnable interfaces",
)

# Adding chain route
add_routes(app, chian, path="/chain")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
