'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchemaRegister = z.object({
    nome: z.string().min(1, { message: "Seu nome deve ter pelo menos duas letras" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Senha deve conter no mínimo 6 caracteres" }),
})

const formSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Senha deve conter no mínimo 6 caracteres" }),
})


export default function Login() {
    const [showRegister, setShowRegister] = useState(false);

    const router = useRouter();
    const formRegister = useForm<z.infer<typeof formSchemaRegister>>({
        resolver: zodResolver(formSchemaRegister),
        defaultValues: {
            nome: "",
            email: "",
            password: "",
        },
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push("/chat");
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    form.setError("root", { message: "Email ou senha inválidos" });
                } else {
                    form.setError("root", { message: "Erro inesperado: " + error.message });
                }
            });
    }

    async function onSubmitRegister(data: z.infer<typeof formSchemaRegister>) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            updateProfile(auth.currentUser!, {
                displayName: data.nome
            }).then(() => {
                router.push("/chat");
            })

        })
        .catch((error) => {
        if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            formRegister.setError("root", { message: "Email ou senha inválidos" });
        } 
        else if (error.code == "auth/email-already-in-use") {
            formRegister.setError("root", { message: "Já existe um usuário vinculado a esse email" });
        } 
        else {
            formRegister.setError("root", { message: "Erro inesperado: " + error.message });
        }
        });
    }

    

    



    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <Image src="https://upload.wikimedia.org/wikipedia/pt/f/f9/Furia_Esports_logo.png" alt="Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-4xl font-bold mb-4 text-white">Seja bem-vindo <span className="text-amber-500 italic">furioso</span></h1>


            <Card className={`w-96 h-fit relative ease transition-all duration-500 bg-gray-800 border-none text-white rounded-2xl shadow-lg shadow-black/30
                            ${showRegister ? "h-fit" : "h-102"}`}>

                <div
                    className={`absolute inset-0 py-6 px-5 flex flex-col justify-between transition-all duration-500 ease-in-out gap-2
                                ${showRegister ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-center">Login</CardTitle>
                        <p className="text-gray-300 text-sm text-center">Insira seus dados para entrar no <i className="font-bold">Chat Furioso!</i></p>

                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                                <FormField

                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />
                                {form.formState.errors.root && (
                                    <p className="text-red-500 text-sm w-full text-center">
                                        {form.formState.errors.root.message}
                                    </p>
                                )}
                                <Button type="submit" className="cursor-pointer">Login</Button>
                            </form>
                        </Form>

                    </CardContent>
                    <CardFooter className="flex justify-center text-sm">
                        <span className="h-fit">
                            Não tem conta?{" "}
                            <Button
                                variant="ghost"
                                onClick={() => setShowRegister(true)}
                                className="group text-white relative px-0"
                                >
                                <span className="relative cursor-pointer">
                                    Crie uma conta!
                                    <span className="block absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Button>
                        </span>
                    </CardFooter>
                </div>

                <div
                    className={`inset-0 px-4 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out
          ${showRegister ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                    <span className="text-lg font-bold">Criação de Conta</span>
                    <p className="text-gray-300 text-sm mb-4">Insira seus dados para criar uma nova conta</p>
                    <Form {...formRegister}>
                        <form onSubmit={formRegister.handleSubmit(onSubmitRegister)} className="flex flex-col w-full p-4">
                            <FormField
                                control={formRegister.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem className="mb-8">
                                        <FormLabel>Seu nome</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Seu nome" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formRegister.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="mb-8">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formRegister.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mb-2">
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Senha" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
                            {formRegister.formState.errors.root && (
                                <p className="text-red-500 text-sm text-left italic w-full mb-8">
                                    {formRegister.formState.errors.root.message}
                                </p>
                            )}
                            <Button className="cursor-pointer mt-4" type="submit">Registrar</Button>

                        </form>
                    </Form>



                    <Button
                        variant="ghost"
                        onClick={() => setShowRegister(false)}
                        className="group mt-4 text-white relative px-0"
                        >
                        <span className="relative cursor-pointer">
                            Voltar para login
                            <span className="block absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Button>

                </div>

            </Card>
        </div>
    );
}
