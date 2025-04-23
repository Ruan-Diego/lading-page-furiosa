import { useState } from 'react';


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
    const [messages, setMessages] = useState<Message[]>([]);
    
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
  
    return (
        <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          🗨️
        </button>
        
        {isOpen && (
          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.isBot ? 'bot' : ''}`}>
                  {msg.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                </div>
              ))}
            </div>
            
            <div className="quick-questions">
              <button onClick={() => handleTeamQuery('valorant')}>Valorant</button>
              <button onClick={() => handleTeamQuery('cs')}>CS2</button>
              <button onClick={() => handleTeamQuery('rocketleague')}>Rocket League</button>
              <button onClick={() => handleTeamQuery('kingsleague')}>Kings League</button>
            </div>
          </div>
        )}
      </div>

    );
  };