import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: 'Você é um assistente da Furia Esports. Responda de forma amigável e informal e com infomrações concisas e atuais sobre a Furia Esports.',
      messages: messages,
    });

    return result.toDataStreamResponse();

  } catch (error: any | unknown) {
    console.error('Erro detalhado:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Erro interno do servidor'
      }), 
      {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      }
    );
  }
}