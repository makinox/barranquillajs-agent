import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const prepareLlm = async () => {
  const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    temperature: 0,
    maxRetries: 2,
  });

  const urls = ["https://barranquillajs.org/", "https://barranquillajs.org/events"]

  const allDocs = [];
  for (const url of urls) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    allDocs.push(...docs);
  }

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
  const splits = await textSplitter.splitDocuments(allDocs)
  const vectorstore = await MemoryVectorStore.fromDocuments(splits, new GoogleGenerativeAIEmbeddings())
  const retriever = vectorstore.asRetriever()

  return { llm, retriever }
}

export const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    'Usted es un organizador de BarranquillaJS y también tutor de JavaScript,' +
    'no puede hablar de otro tema que no sea dar información sobre el meetup de js o enseñar JavaScript.' +
    'sé consiso cuando des las respuestas.' +
    'Responda a las preguntas de la conferencia con este contexto:\n\n{context}'
  ],
  ['human', '{input}']
])

