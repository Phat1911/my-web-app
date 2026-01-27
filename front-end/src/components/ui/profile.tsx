"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { updateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Profile = () => {
    const form = useForm({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: "...",
            email: "...",
        },
    });
    const [isPending, setIsPending] = useState <boolean> (false);
    const [url, setURL] = useState <string> ("");
    const [st, setSt] = useState <number>(0);
    const [sc, setSc] = useState <string>("...");
    const [mark, setMark] = useState <[boolean, boolean]>([false, false]);

    useEffect(() => {
        async function findUser() {
            try {
                const res = await api.get("/auth/me");

                setSc(res.data.score as string);
                setURL(res.data.previewURL);
                form.reset({
                    name: res.data.name,
                    email: res.data.email,
                });
                console.log("avt12: ", res.data.previewURL);
            } 
            catch (err) {
                console.error(err);
            }
        }
        findUser();
    }, [st]);

    async function onSubmit (values: z.infer <typeof updateSchema>) {
        try {
            const result = updateSchema.safeParse(values);

            if (!result.success) {
                return { status: "error", message: result.error.message };
            }
            setIsPending(true);
            await api.post("/auth/update", {
                name: values.name,
                email: values.email,
            });
            setIsPending(false);
            setSt(st + 1);
            return { status: "success" };
        } catch(err: any) {
            console.log(err);
            return { status: "error", message: err.response?.data?.error || "Something went wrong", };
        }
    }

    const handleChange = async (e: any) => {
        const file = e.target.files?.[0];
        
        const formData = new FormData();
        formData.append("previewURL", file);
        setMark([false, true]);
        await api.post("/auth/updateAvt", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }, 
        });
        setSt((st) => st + 1);
        setMark([true, false]);
    }

    return (
        <div className="h-screen bg-[#1A1A1A] flex flex-col justify-center items-center">
            <Form {...form}>
                <div className="flex bg-black justify-center items-center">
                    <div className="ml-[30px] flex flex-col items-center justify-center rounded-lg shadow-2xl">
                        {
                            url === "" ? <img src="avt.jpg" width={150} /> : (
                                mark[1] ? <div className="text-white">Updating...</div> : <img src={url} width={150} />
                            )
                        }
                        <input type="file" id="file" className="hidden" disabled={mark[1]} onChange={handleChange} />
                        <label htmlFor="file" className="text-[1.8rem] cursor-pointer">📷</label>
                    </div>
                    <form className="space-y-4 text-white font-bold p-[50px]" onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex">
                                <FormLabel className="w-[100px]">User Name: </FormLabel>
                                <FormControl>
                                    <Input className="border-none" type="text" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <div>
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                <div className="flex">
                                    <FormLabel>Email: </FormLabel>
                                    <FormControl>
                                        <Input className="border-none" type="email" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div>Score: {sc}</div>
                    <Button disabled={isPending} className="w-full cursor-pointer" type="submit">
                        { isPending ? "Updating..." : "Update" }
                    </Button>
                    </form>
                </div>
            </Form>
            {mark[0] && <p className="text-white">Updated, Refresh to see the difference</p>}
        </div>
    )
}

export default Profile