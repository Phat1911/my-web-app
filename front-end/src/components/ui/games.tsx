"use client";

import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Game = () => {
    const [games, setGames] = useState <any> (null);

    useEffect(() => {
        async function getAllGames () {
            const g = await api.get("/game");
            setGames(g.data);
        }

        getAllGames();
        console.log("Completed");
    }, []);

    return (
        <div className="text-white w-full p-[60px_60px] ">
            {games ? <div className="flex space-x-10 flex-wrap">
                {
                    games.map((g: any, id: number) => (
                        <Link href={`/${g.title.split(" ")[0].toLowerCase()}`} className="space-y-2 shadow-sm hover:shadow-lg hover:scale-[1.1] shadow-white/50 transition duration-300 cursor-pointer p-[20px] rounded-lg">
                            <img src={g.image} width={150} />
                            <p>{g.title}</p>
                            <p>Value: {g.value}</p> 
                            { id == 2 && <p>Number of minutes * value</p> }
                        </Link >
                    ))
                }
            </div> :
                <div className="text-white">Loading...</div>
            }
        </div>
    )
}

export default Game