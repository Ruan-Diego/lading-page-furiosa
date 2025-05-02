import furiaLogo from '@/assets/furia-logo.png';
import Image from "next/image";

import { auth } from "@/firebase";
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export default function Header() {
  const router = useRouter();
  async function logout() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }
  
  return (
    <div className="flex items-center justify-center w-full h-16 px-4 bg-gray-900 text-white">
    <h4 className="text-2xl font-bold text-amber-400 absolute left-0 pl-16">FURIA ESPORTS</h4>
    
    <Image width={100} height={100} src={furiaLogo} alt="Furia" className="absolute right-0 pr-16" />
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <LogOut className="absolute right-16 m-16 hover:text-red-500 duration-500 cursor-pointer"></LogOut>
      </AlertDialogTrigger>
      <AlertDialogContent className="top-28">
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está saindo da sua conta no aplicativo Chat Furioso!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/chat">
              Chat
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
