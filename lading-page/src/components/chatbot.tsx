'use client'
import { smoothScrollToElement } from '@/utils/smoothScroll';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';




type Message = {
    text: string;
    isBot: boolean;
  };
  
type TeamData = {
    integrantes: string[];
    titulos: string[];
    situacao: string;
    camisa: string;
};

export function ChatBot() {  
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([{text: 'Olá, eu sou o FURIA Chatbot. Como posso ajudar você hoje?', isBot: true}]);
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (bottomRef.current) {
        smoothScrollToElement(bottomRef.current, 1500);
      }
    }, [messages]);
    
    
    const teamData: Record<string, TeamData> = {
      valorant: {
        integrantes: ['Khalil', 'mwzera', 'havoc', 'heat', 'raafa'],
        titulos: ['Participação no Valorant Champions 2021 e 2022', 'Vaga permanente na liga internacional VALORANT desde 2022'],
        situacao: 'Ativo na liga internacional - Temporada 2025',
        camisa: 'https://furia.gg/store/valorant'
      },
      kingsleague: {
        integrantes: ['Time draftado com 13 jogadores (10 selecionados em draft)'],
        titulos: ['Participação na Kings League Brasil 2025'],
        situacao: 'Em preparação para a primeira temporada',
        camisa: 'https://furia.gg/store/kingsleague'
      },
      cs: {
        integrantes: ['FalleN', 'chelo', 'yuurih', 'skullz', 'KSCERATO'],
        titulos: [
          'ESL Pro League Season 12 NA Champions',
          '3º-4º no IEM Rio Major 2022',
          'Semifinalista do PGL Major Antwerp 2022'
        ],
        situacao: 'Em reformulação com novos membros internacionais',
        camisa: 'https://furia.gg/store/csgo'
      },
      rocketleague: {
        integrantes: ['drufinho', 'Lostt', 'yanxnz'],
        titulos: [
          'Campeões do Gamers8 2022',
          '3º-4º no RLCS 2022',
          'MVP Sul-Americano (yanxnz)'
        ],
        situacao: 'Top 3 no ranking sul-americano',
        camisa: 'https://furia.gg/store/rocketleague'
      }
    };
  
    const handleTeamQuery = (team: keyof typeof teamData) => {
      const data = teamData[team];
      const response = `
        Integrantes: ${data.integrantes.join(', ')}
        Títulos: ${data.titulos.join('\n      ')}
        Situação Atual: ${data.situacao}
        Camisas: ${data.camisa}
      `;
      setMessages([...messages, { text: response, isBot: true }]);
    };
  
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userMessage = formData.get('message') as string;
    console.log(userMessage);
    setMessages([...messages, { text: userMessage, isBot: false }]);

  }
  
    return (
        <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-400 text-black rounded-full p-4 shadow-lg hover:bg-amber-500 transition-all"
      >
        🗨️ Chat FURIA
      </button>

      {isOpen && (
        <div className="mt-4 bg-gray-900 rounded-lg shadow-xl w-96 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.isBot ? 'bg-gray-800 mr-8' : 'bg-amber-400 text-black ml-8'
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
            ))}
            <div ref={bottomRef} className="scroll-smooth"/>
          </div>
          <form className='flex gap-2 p-4 border-t border-gray-700' onSubmit={handleSubmit}>
            <Input name="message" type="text" placeholder="Pergunte o que quiser sobre a FURIA" />
            <Button className='bg-amber-400 hover:bg-amber-500 text-black' type="submit">Enviar</Button>
          </form>

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