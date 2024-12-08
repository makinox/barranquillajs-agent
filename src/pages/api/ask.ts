import type { APIRoute } from "astro";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { prepareLlm, promptTemplate } from "../../utils/llm";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") return new Response(null, { status: 400 });

  try {
    const { llm, retriever } = await prepareLlm()
    const body = await request.json();
    const message = body.message

    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt: promptTemplate,
      outputParser: new StringOutputParser()
    })
    const retrievedDocs = await retriever.invoke(message)
    const response = await ragChain.invoke({
      input: message,
      context: retrievedDocs
    })


    return new Response(JSON.stringify({
      message: response
    }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 400 })
  }


}