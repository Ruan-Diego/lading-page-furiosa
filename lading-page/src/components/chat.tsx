import { normalizeText } from "@/utils/nomalizeText";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


interface ChatProps {
    escolha: string;
    handleChat: (item: string) => void;
}

const infoTeam = [
     'Camisa','Integrantes', 'Títulos', 'Situação', 'Voltar'
]



export function Chat({ escolha, handleChat }: ChatProps) {
    const [infoTeamEscolhida, setInfoTeamEscolhida] = useState<string>();

    function handleInfoTeam(item: string) {
        if(item == 'Voltar'){
            handleChat('');
        } else {
            const escolhaTeam = TeamData[escolha as keyof typeof TeamData];
            const value = escolhaTeam[normalizeText(item) as keyof typeof escolhaTeam];
            setInfoTeamEscolhida(value);
        }        
    }

    return (
        <div>
            <div className="flex items-center gap-2">
                <div className='flex items-center gap-2 p-3 rounded-lg bg-gray-800 mr-8'>
                    <Avatar>
                        <AvatarFallback>RD</AvatarFallback>
                        <AvatarImage src="https://cdn.dribbble.com/userupload/11627402/file/original-519eba43b5e06c4036ad54fe2b6e496f.png" />
                    </Avatar>
                    <p className="text-sm break-all">Quais informações você gostaria de saber sobre o time de {escolha}?</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {infoTeam.map((item) => (
                    <button onClick={() => handleInfoTeam(item)} key={item} className='text-sm break-all p-3 rounded-lg bg-amber-400 text-black hover:bg-amber-500 transition-all cursor-pointer mt-2'>
                        {item}
                    </button>
                ))}
            </div>
            {infoTeamEscolhida && (
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 mr-8">
                        <p>{Array.isArray(infoTeamEscolhida) ? infoTeamEscolhida.join(', ') : infoTeamEscolhida}</p>
                    </div>
                </div>
            )}
        
      </div>



    )
}

