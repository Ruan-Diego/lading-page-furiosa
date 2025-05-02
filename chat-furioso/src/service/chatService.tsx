import { db } from "@/firebase";
import { ChatMessage } from "@/models/ChatMessage";
import { MessagePronta } from "@/models/MessagePronta";
import { User } from "firebase/auth";
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";


export function listenToMessages(callback: (messages: ChatMessage[]) => void) {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChatMessage, "id">),
      }));
      callback(msgs);
    });
  }
  
export async function sendMessage(content: string, currentUser: User): Promise<void> {
  await addDoc(collection(db, "messages"), {
    content,
    user: {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName
      },
    timestamp: Timestamp.now(),
  });
}

export async function getAllMessages(): Promise<ChatMessage[]> {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ChatMessage, "id">),
  }));


}

export async function getMensagensProntas() {
  const mensagensRef = collection(db, "messagesReady");
  const snapshot = await getDocs(mensagensRef);

  const mensagens: MessagePronta[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    jogadoresprincipais: doc.data().jogadoresprincipais,
    placaresultimosjogos: doc.data().placaresultimosjogos,
    proximosjogos: doc.data().proximosjogos,
    situacaocampeonato: doc.data().situacaocampeonato,
    createdAt: doc.data().createdAt
  }));

  return mensagens;
}
