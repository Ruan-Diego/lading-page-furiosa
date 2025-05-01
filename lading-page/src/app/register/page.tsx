"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";


const formSchema = z.object({
  email: z.string().email({message: "Email inválido"}),
  password: z.string().min(6, {message: "Senha deve conter no mínimo 6 caracteres"}),  
})
    
  


export default function Register() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "" ,
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
          const user = userCredential.user;
          
          // 1. Pegue o ID Token do usuário
          const idToken = await user.getIdToken();
          
          // 2. Armazene o token em um cookie (para o servidor poder verificar)
          document.cookie = `__session=${idToken}; path=/; Secure; SameSite=Lax`;
          
          // 3. Redirecione
          router.push("/");
          router.refresh();
        } catch (error) {

        if (error?.code === "auth/invalid-credential") {
            form.setError("root", { message: "Email ou senha inválidos" });
            }


        }
      }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <img src="https://upload.wikimedia.org/wikipedia/pt/f/f9/Furia_Esports_logo.png" alt="Logo" className="w-24 h-24 mb-4"/>
            <h1 className="text-4xl font-bold mb-4 text-white">Conheça o <span className="text-amber-500 italic">furioso</span></h1>

            <Card className="w-96 bg-gray-800 text-white border-none shadow-none">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                            <FormField
                                control={form.control}
                                name="email"
                            render={({ field }) => (
                                <FormItem>
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
                                    <FormItem>  
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="cursor-pointer">Login</Button>
                        </form>
                    </Form>

                </CardContent>
                <CardFooter>
                    <span>Você não tem conta? <Link href="/login">Ir para login</Link></span>
                </CardFooter>
            </Card>
        </div>
    );
  }
  