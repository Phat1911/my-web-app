"use client";

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState <any> ();

    useEffect(() => {
        async function findUser() {
            try {
                const res = await api.get("/auth/me", {
                    withCredentials: true,
                });

                setUser(res.data); 
                console.log(res.data);
            } 
            catch (err) {
                console.error(err);
            }
        }
        findUser();
    }, []);

    return (
        <div className="h-screen bg-[#1A1A1A] flex justify-center items-center">
            <div className="bg-black text-white">
                <div>User Name: {user?.name}</div>
                <div>Score: {user?.score}</div>
                <div>Email: {user?.email}</div>
            </div>
        </div>
    )
}

export default Profile