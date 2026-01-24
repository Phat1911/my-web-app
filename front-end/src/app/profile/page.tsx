"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { updateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateProfile } from "../actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Profile = () => {
    const [user, setUser] = useState <any> ({
        name: "...",
        score: "...",
        email: "...",
    });
    const form = useForm({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: "...",
            email: "...",
        },
    });
    const [file, setFile] = useState <File | null> (null);
    const [isPending, setIsPending] = useState <boolean> (false);
    const [url, setURL] = useState <string> ("");
    const [st, setSt] = useState <number>(0);
    const [mark, setMark] = useState <boolean>(false);
    const previewURL = file ? URL.createObjectURL(file) : "";

    useEffect(() => {
        console.log(123);
        async function findUser() {
            try {
                const res = await api.get("/auth/me", {
                    withCredentials: true,
                });

                setUser(res.data); 
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
            }, { withCredentials: true });
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
        await api.post("/auth/updateAvt", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }, 
        });
        setMark(true);
        setSt((st) => st + 1);
    }

    return (
        <div className="h-screen bg-[#1A1A1A] flex flex-col justify-center items-center">
            <Form {...form}>
                <div className="flex bg-black justify-center items-center">
                    <div className="ml-[30px] flex flex-col items-center justify-center rounded-lg shadow-2xl">
                        {url !== "" ? <img src="867c66c0-360b-4dba-82b9-80f82710d73c.jpg" alt="" width={150} /> : <div className="text-[9rem] ">🙍</div>}
                        <input type="file" id="file" className="hidden" onChange={handleChange} />
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
                    
                    <div>Score: {user?.score}</div>
                    <Button disabled={isPending} className="w-full cursor-pointer" type="submit">
                        { isPending ? "Updating..." : "Update" }
                    </Button>
                    </form>
                </div>
            </Form>
                    { mark && <p className="text-white">Updated! Refresh to see the difference</p> }
        </div>
    )
}

export default Profile