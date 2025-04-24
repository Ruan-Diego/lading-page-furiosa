import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
    try {

      const { messages } = await req.json();

      const cleanMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content ?? msg.parts?.[0]?.text ?? '',
        }));
      console.log('Mensagens limpas:', cleanMessages);
      
  
      const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        system: 'Você é um assistente útil.',
        messages: cleanMessages,
      });
  
      return result.toDataStreamResponse();
    } catch (error) {
      console.error('Erro no back-end:', error);
      return new Response('Erro interno do servidor.', { status: 500 });
    }
  }
  