import { User } from "./User";

export interface ChatMessage{
    id: string,
    content: string,
    user: User,    
}