'use client'
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/firebase";
import { ChatMessage } from "@/models/ChatMessage";
import { getMensagensProntas, listenToMessages, sendMessage } from "@/service/chatService";
import { smoothScrollToElement } from "@/smoothScroll";
import { normalizeText } from "@/utils/nomalizeText";
import { useChat } from '@ai-sdk/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { z } from "zod";

const infoTeam = [
    'Placares dos últimos jogos', 'Jogadores principais', 'Próximos jogos', 'Situação do campeonato', 'Camisas']
const formSchema = z.object({
    message: z.string().min(1, { message: 'Mensagem é obrigatória' }),
})

export default function Chat() {
    const router = useRouter();
    const [liquipediaData, setLiquipediaData] = useState<Record<string, string>>({});
    const [messagesOnline, setMessagesOnline] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push("/login");
        }
        });
    
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const unsubscribe = listenToMessages(setMessagesOnline);
        return () => unsubscribe();
      }, []);
    
      async function handleSubmitChatOnline(data: z.infer<typeof formSchema>) {
        if(auth.currentUser){
            await sendMessage(data.message, auth.currentUser);
        } else {
            router.push("/login");
        }
        formOnline.reset();
      }

    useEffect(() => {
        fetch('https://ruandgn.app.n8n.cloud/webhook/dados')
        .then(res => res.json())
        .then(data => { data["Camisas"] = 'https://www.furia.gg'; setLiquipediaData(data);  })
        .catch(err => console.error(err))
    }, []);

    const bottomRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    })

    const formOnline = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    })

    const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        sendExtraMessageFields: false,
    });

    useEffect(() => {
        if (bottomRef.current) {
            smoothScrollToElement(bottomRef.current, 1500);
        }
    }, [messages]);

    useEffect(() => {
        if (bottomRef.current) {
            smoothScrollToElement(bottomRef.current, 1500);
        }
    }, [messagesOnline]);

    function addFirstMessage() {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    content: 'Olá no que eu posso te ajudar furioso(a)?',
                    role: 'assistant'
                }
            ]);
        }
    }
    

    async function handleInfoTeam(item: string) {
        console.log(liquipediaData)
        if (!liquipediaData || Object.keys(liquipediaData).length === 0) {
            
            await getMensagensProntas().then((mensagensProntas) => {
                const normalizedItem = normalizeText(item);
                const primeiraMensagem = mensagensProntas[0];
                const respostaRaw = primeiraMensagem[normalizedItem];

                // Se for Timestamp, ignora ou converte
                const resposta = respostaRaw instanceof Timestamp
                  ? respostaRaw.toDate().toISOString()
                  : respostaRaw;
                
                setMessages([
                    ...messages,
                    {
                        id: crypto.randomUUID(),
                        content: 'Me fale sobre ' + item,
                        role: 'user',
                    },
                    {
                        id: crypto.randomUUID(),
                        content: resposta || 'Ainda estou pesquisando mais sobre isso, você me daria alguns segundos?',
                        role: 'assistant',
                    },
                ]);
            });
            

        
        

        } else{
            const data = liquipediaData;
            const resposta = data?.[item];
            setMessages([
                ...messages,
                {
                    id: crypto.randomUUID(),
                    content: 'Me fale sobre ' + item,
                    role: 'user',
                },
                {
                    id: crypto.randomUUID(),
                    content: resposta || 'Ainda estou pesquisando mais sobre isso, você me daria alguns segundos?',
                    role: 'assistant',
                },
            ]);
        }        
    }

    return (
        <>
        <Header/>
            <div className="bg-gray-900 min-h-screen w-full py-4 text-white">
                <main className="flex flex-col bg-gray-800 p-8 rounded-lg shadow-lg mx-40">
                    <h2 className="text-2xl font-bold text-amber-400 mb-6">Bem vindo aos chats da FURIA</h2>
                    <Tabs >
                        <TabsList className="w-full text-white">
                            <TabsTrigger value="chatOnline">Chat online</TabsTrigger>
                            <TabsTrigger value="chatBot" onClick={addFirstMessage}>Assistente furioso</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chatOnline">
                            <ScrollArea className="h-160">
                            <div className="flex flex-col bg-gray-800 p-4 rounded-lg">
                                    {messagesOnline.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-3 my-1 rounded-lg 
                                            ${msg.user.uid !== auth.currentUser?.uid ? 'bg-gray-900 mr-8' : 'bg-amber-400 text-black ml-8'}`}
                                        >
                                            <div className="flex  gap-2">
                                                <Avatar>
                                                    <AvatarFallback>{msg.user?.name?.split(" ").map((n) => n[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase() || 'DF'}
                                                    </AvatarFallback>
                                                    {msg.user.uid !== auth.currentUser?.uid ? (<AvatarImage src="" />) : (
                                                        <AvatarImage src="" />)}
                                                        
                                                </Avatar>
                                                <div className="prose dark:prose-invert prose-sm text-sm break-all">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={bottomRef} className="scroll-smooth" />
                                </div>
                            </ScrollArea>
                            <Form {...formOnline}>
                                <form className='flex flex-col gap-2 p-4 border-t border-gray-700' onSubmit={formOnline.handleSubmit(handleSubmitChatOnline)}>
                                    <div className="flex gap-2">
                                        <FormField
                                            control={formOnline.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Interaja com os mais furiosos da internet"/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className='bg-amber-400 hover:bg-amber-500 text-black' type="submit">Enviaaar</Button>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="chatBot">
                            <ScrollArea className="h-160" >
                                <div className="flex flex-col bg-gray-800 p-4 rounded-lg">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-3 my-1 rounded-lg ${msg.role === 'assistant' ? 'bg-gray-900 mr-8' : 'bg-amber-400 text-black ml-8'
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
                                    ))}
                                    <div ref={bottomRef} className="scroll-smooth" />
                                </div>
                            </ScrollArea>
                            <Form {...form}>
                                <form className='flex flex-col gap-2 p-4 border-t border-gray-700' onSubmit={handleSubmit}>
                                    <div className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Pergunte o que quiser sobre a FURIA" value={input} onChange={handleInputChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className='bg-amber-400 hover:bg-amber-500 text-black' type="submit">Enviar</Button>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        {infoTeam.map((item) => (
                                            <button onClick={() => handleInfoTeam(item)} key={item} className='text-sm break-all p-3 rounded-lg bg-amber-400 text-black hover:bg-amber-500 transition-all cursor-pointer mt-2'>
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

        </>
        

    );
}
