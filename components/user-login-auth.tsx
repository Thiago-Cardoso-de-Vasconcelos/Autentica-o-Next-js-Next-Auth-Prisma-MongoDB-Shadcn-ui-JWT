"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { signIn } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  email: string;
  password: string;
}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const [data, setData] = useState<IUser>({
    email: "",
    password: "",
  });
  

  const { toast }= useToast();

  const router = useRouter();

  const [isLoading, setIsLoadig] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    
    const res = await signIn<"credentials">("credentials", {
      ...data,
      redirect: false,
    })

    if(res?.error) {
      toast({
        title: "Oooops...",
        description: res.error,
        variant: "destructive",
        action: (
          <ToastAction altText="Tente Novamente">Tente Novamente</ToastAction>
        ),
      });
    }else {
      router.push("/");      
    }



    setIsLoadig(true);
    setData({
      email: "",
      password: "",
    })
    setIsLoadig(false);
  }

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setData((prev) =>{
    return{...prev, [e.target.name]: e.target.value}
  })

}

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
            id="email"
            placeholder="name@exemple.com"
            type="email"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            name="email"
            value={data.email}
            onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="passwrd">
              Password
            </Label>
            <Input
            id="password"
            placeholder="Senha"
            type="password"
            autoComplete="none"
            autoCorrect="off"
            disabled={isLoading}
            name="password"
            value={data.password}
            onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}
