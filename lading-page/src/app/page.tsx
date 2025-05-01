'use client'
import { ChatBot } from "@/components/chatbot";
import Header from "@/components/Header";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const logout = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => logout();
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  async function logout() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }
  
  return (
    <div className="bg-gray-900 w-full h-screen">
      <Header />
      <div className="min-h-screen bg-gray-900 text-white">

      <main className="max-w-6xl mx-auto px-4">
        <section className="my-16 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-amber-400 mb-6">Sobre a Organização</h2>
          <p className="text-gray-300">
            Fundada em 2017 em São Paulo, a FURIA se tornou uma das principais organizações de esports do mundo.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900 p-4 rounded text-center">
              🏆 $4.9M em prêmios
            </div>
            <div className="bg-gray-900 p-4 rounded text-center">
              🌎 30+ países
            </div>
          </div>
        </section>

        <section className="my-16 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-amber-400 mb-6">Competições</h2>
          <ul className="space-y-3 text-gray-300">
            <li>🏆 Counter-Strike 2 - ESL Pro League</li>
            <li>🎮 Valorant - Champions Tour</li>
            <li>🚀 Rocket League - RLCS</li>
          </ul>
        </section>

        <section className="my-16 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-amber-400 mb-6">Contato</h2>
          <div className="space-y-2 text-gray-300">
            <p>📧 contato@furia.gg</p>
            <div className="flex gap-4 mt-4">
              <a href="https://twitter.com/furia" className="hover:text-amber-400">
                Twitter
              </a>
              <a href="https://instagram.com/furia" className="hover:text-amber-400">
                Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <ChatBot />
    </div>
    </div>
  );
}
