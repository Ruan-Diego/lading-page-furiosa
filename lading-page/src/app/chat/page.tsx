'use client'
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { smoothScrollToElement } from "@/utils/smoothScroll";
import { useChat } from '@ai-sdk/react';
import { zodResolver } from "@hookform/resolvers/zod";
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
    const [liquipediaData, setLiquipediaData] = useState<
        {
            "Time Principal:": "A escalação ativa da FURIA é: yuurih, KSCERATO, FalleN (Líder), molodoy e YEKINDAR (Stand-in). Sidde é o treinador.",
            "Próximos Jogos:": "FURIA competirá na PGL Astana 2025 a partir de 10 de maio de 2025, IEM Dallas 2025 a partir de 19 de maio de 2025, e no BLAST.tv Austin Major 2025 a partir de 2 de junho de 2025.",
            "Placares dos Últimos Jogos:": "Os resultados dos jogos mais recentes são: Derrota contra The MongolZ (0:2) em 9 de abril de 2025. Derrota contra Virtus.pro (0:2) em 8 de abril de 2025. Derrota contra Complexity (1:2) em 7 de abril de 2025. Vitória contra Betclic Apogee Esports (2:0) em 6 de abril de 2025. Derrota contra M80 (1:2) em 22 de março de 2025 Derrota contra Natus Vincere (0:2) em 20 de março de 2025. Derrota contra Team Falcons (1:2) em 10 de março de 2025. Vitória contra MIBR (2:1) em 9 de março de 2025. Derrota contra Team Liquid (0:2) em 8 de março de 2025. Derrota contra MOUZ (1:2) em 7 de março de 2025.",
            "Situação do Campeonato:": "A FURIA participou recentemente da PGL Bucharest 2025, ESL Pro League Season 21: Stage 2 e BLAST Open Spring 2025."
        }
    >();

    useEffect(() => {
        getDataFromLiquipedia();
    }, []);

    function getDataFromLiquipedia() {
        fetch('https://ruandgn.app.n8n.cloud/webhook-test/dados')
            .then(res => res.json())
            .then(data => { data["Camisas"] = 'https://www.furia.gg'; setLiquipediaData(data) })
            .catch(err => console.error(err))
    }

    const bottomRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
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

    function handleInfoTeam(item: string) {
        if (!liquipediaData) return;

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
                content: resposta || 'Desculpe, não encontrei informações sobre isso.',
                role: 'assistant',
            },
        ]);
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
                            <TabsTrigger value="chatBot">Assistente furioso</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chatOnline">
                            <ScrollArea className="h-160">

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
                                                        <Input {...field} placeholder="Interaja com os mais furiosos da internet" value={input} onChange={handleInputChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className='bg-amber-400 hover:bg-amber-500 text-black' type="submit">Enviar</Button>
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
