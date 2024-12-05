import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") return new Response(null, { status: 400 });

  const body = await request.json();
  const message = body.message;
  return new Response(JSON.stringify({
    message: "Your message was: " + message
  }), { status: 200 })


}