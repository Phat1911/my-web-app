"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { loginSchema } from "@/schemas";
import { login, register } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState <string>("");
    const [isPending, setIsPending] = useState <boolean> (false);
    
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsPending(true);
        const result = await login(values);
        setIsPending(false);
        console.log(result.message);

        if (result.status === "success") {
            router.push("/");
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md p-6 shadow-lg">
            <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
                Log in
            </CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="Enter Your Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div>
                    <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Enter Your Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <Button disabled={isPending} className="w-full cursor-pointer" type="submit">
                    { isPending ? "Loging in..." : "Log in" }
                </Button>
                <p className="flex justify-center">If don't have account, go to <Link href='/sign-up' className="ml-[5px] cursor-pointer underline text-blue-600"> Sign up ➡️</Link></p>
                <p className="flex justify-center text-red-500">{error}</p>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
};

export default Login;