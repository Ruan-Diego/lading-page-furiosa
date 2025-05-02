import { Timestamp } from "firebase/firestore";

export interface MessagePronta {
    id: string;
    jogadoresprincipais: string;
    placaresultimosjogos: string;
    proximosjogos: string;
    situacaocampeonato: string;
    createdAt: Timestamp;

    [key: string]: string | Timestamp; 
}