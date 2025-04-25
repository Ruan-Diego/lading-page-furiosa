'use client'

import { TeamData } from '@/models/TeamData';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import { useChat } from '@ai-sdk/react';
import { zodResolver } from "@hookform/resolvers/zod";
import 'highlight.js/styles/vs2015.css';
import { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { z } from "zod";
import { Chat } from './chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Mensagem é obrigatória' }),
})

export function ChatBot() {
  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    sendExtraMessageFields: false,
  });

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'O que você gostaria de saber sobre a fúria?'
      }
    ]);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [escolha, setEscolha] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  function handleClick(): void {
    if (escolha != '') {
      setEscolha('');
      clearChat();
    }

  }

  useEffect(() => {
    if (bottomRef.current) {
      smoothScrollToElement(bottomRef.current, 1500);
    }
  }, [messages]);

  const handleTeamQuery = (team: string) => {
    setEscolha(team as keyof typeof TeamData);
  };



  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setEscolha('');
          clearChat();
        }}
        className="bg-amber-400 text-black rounded-full p-4 shadow-lg hover:bg-amber-500 transition-all"
      >
        🗨️ Chat FURIA
      </button>


      {isOpen && (
        <div className="mt-4 bg-gray-900 rounded-lg shadow-xl w-108 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {escolha == '' ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${msg.role === 'assistant' ? 'bg-gray-800 mr-8' : 'bg-amber-400 text-black ml-8'
                    }`}
                >
                  <div className="flex  gap-2">
                    <Avatar>
                      <AvatarFallback>RD</AvatarFallback>
                      {msg.role === 'assistant' ? (<AvatarImage src="https://cdn.dribbble.com/userupload/11627402/file/original-519eba43b5e06c4036ad54fe2b6e496f.png" />) : (
                        <AvatarImage src="" />)}
                    </Avatar>
                      <div className="prose dark:prose-invert prose-sm text-sm break-all">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                  </div>
                </div>
              ))
            ) : (
              <div>

                <Chat escolha={escolha} handleChat={() => { setEscolha('');}} />
              </div>
            )}
            <div ref={bottomRef} className="scroll-smooth" />
          </div>

          <Form {...form}>
            <form className='flex gap-2 p-4 border-t border-gray-700' onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input {...field} placeholder="Pergunte o que quiser sobre a FURIA" value={input} onChange={handleInputChange} onClick={handleClick}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='bg-amber-400 hover:bg-amber-500 text-black' type="submit">Enviar</Button>
            </form>
          </Form>

          <div className="grid grid-cols-2 gap-2 p-4 border-t border-gray-700">
            <button
              onClick={() => handleTeamQuery('valorant')}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded text-sm"
            >
              Valorant
            </button>
            <button
              onClick={() => handleTeamQuery('cs')}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded text-sm"
            >
              CS2
            </button>
            <button
              onClick={() => handleTeamQuery('rocketleague')}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded text-sm"
            >
              Rocket League
            </button>
            <button
              onClick={() => handleTeamQuery('kingsleague')}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded text-sm"
            >
              Kings League
            </button>
          </div>
        </div>
      )}
    </div>

  );
};