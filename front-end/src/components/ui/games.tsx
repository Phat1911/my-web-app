"use client";

import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const Game = () => {
    const [games, setGames] = useState<any>(null);

    useEffect(() => {
        async function getAllGames() {
            const g = await api.get("/game");
            setGames(g.data);
        }
        getAllGames();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Game Arcade
                </h1>
                <p className="text-gray-400 mb-8">Choose your game and start earning points!</p>

                {games ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {games.map((g: any, id: number) => (
                            <Link href={`/${g.title.split(" ")[0].toLowerCase()}`} key={id}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-br from-[#1f1f3a] to-[#2a2a4a] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                                >
                                    <div className="relative overflow-hidden">
                                        <img src={g.image} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-purple-600 rounded-full text-xs font-bold">
                                            Value: {g.value}x
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold mb-2">{g.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            {id === 2 ? "Minutes x Value" : "Score x Value"}
                                        </p>
                                        <motion.div
                                            className="mt-4 py-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Play Now
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Game;