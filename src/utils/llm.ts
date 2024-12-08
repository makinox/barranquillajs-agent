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

  const loader = new CheerioWebBaseLoader('https://barranquillajs.org/events', { selector: 'p, span, h1, h2, h3, h4, h5, h6, a' })
  const docs = await loader.load()
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
  const splits = await textSplitter.splitDocuments(docs)
  const vectorstore = await MemoryVectorStore.fromDocuments(splits, new GoogleGenerativeAIEmbeddings())
  const retriever = vectorstore.asRetriever()

  return { llm, retriever }
}

export const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    'Usted es un organizador de BarranquillaJS y también tutor de JavaScript,' +
    'no puede hablar de otro tema que no sea dar información sobre el meetup de js o enseñar JavaScript.' +
    'Responda a las preguntas de la conferencia con este contexto:\n\n{context}'
  ],
  ['human', '{input}']
])

