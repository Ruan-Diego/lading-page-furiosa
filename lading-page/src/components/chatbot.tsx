'use client'

import { TeamData } from '@/models/TeamData';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Chat } from './chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

type Message = {
  text: string;
  isBot: boolean;
};

const formSchema = z.object({
  message: z.string().min(1, { message: 'Mensagem é obrigatória' }),
})

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ text: 'Olá, eu sou o FURIA Chatbot. Como posso ajudar você hoje?', isBot: true }]);
  const [escolha, setEscolha] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>): void {
    const userMessage = values.message;
    if (escolha == '') {
      setMessages([...messages, { text: userMessage, isBot: false }]);
      form.reset();
    } else {
      setEscolha('');
      setMessages([{ text: userMessage, isBot: false }]);
      form.reset();
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
        }}
        className="bg-amber-400 text-black rounded-full p-4 shadow-lg hover:bg-amber-500 transition-all"
      >
        🗨️ Chat FURIA
      </button>


      {isOpen && (
        <div className="mt-4 bg-gray-900 rounded-lg shadow-xl w-108 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {escolha == '' ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg ${msg.isBot ? 'bg-gray-800 mr-8' : 'bg-amber-400 text-black ml-8'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>RD</AvatarFallback>
                      {msg.isBot ? (<AvatarImage src="https://cdn.dribbble.com/userupload/11627402/file/original-519eba43b5e06c4036ad54fe2b6e496f.png" />) : (
                        <AvatarImage src="" />)}
                    </Avatar>
                    <p className="text-sm break-all">{msg.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>

                <Chat escolha={escolha} handleChat={() => { setEscolha(''); setMessages([{ text: 'Olá, eu sou o FURIA Chatbot. Como posso ajudar você hoje?', isBot: true }]) }} />
              </div>
            )}
            <div ref={bottomRef} className="scroll-smooth" />
          </div>

          <Form {...form}>
            <form className='flex gap-2 p-4 border-t border-gray-700' onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Pergunte o que quiser sobre a FURIA" />
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