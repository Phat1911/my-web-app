"use client";

import { Button } from "@/components/ui/button"
import Games from "@/components/ui/games";
import Home from "@/components/ui/home";
import Profile from "@/components/ui/profile";
import Responsible from "@/components/ui/responsible";
import Chat from "@/components/ui/chat";
import { useState } from "react"
import { motion } from "motion/react"
import Ranking from "@/components/ui/ranking";

const navItems = [
  { id: 0, name: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: 1, name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: 2, name: "Games", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
  { id: 3, name: "Tasks", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { id: 4, name: "Ranking", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: 5, name: "Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
];

const Page = () => {
  const [st, setSt] = useState<number>(0);
  const [mark, setMark] = useState<boolean>(false);

  return (
    <div className="flex bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] min-h-screen">
      {/* Animated Sidebar */}
      <motion.div 
        className="fixed left-0 top-0 h-screen z-50 flex items-center"
        animate={!mark ? { x: 0 } : { x: -180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="bg-black/80 backdrop-blur-xl h-full w-[200px] border-r border-white/10 flex flex-col py-6">
          {/* Logo */}
          <div className="px-6 mb-8">
            <motion.h1 
              className="text-2xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              GameHub
            </motion.h1>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSt(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  st === item.id
                    ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.name}</span>
                {st === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">Version 2.0</p>
          </div>
        </div>

        {/* Toggle Button */}
        <motion.button
          className="ml-2 w-8 h-16 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-xl flex items-center justify-center shadow-lg"
          animate={!mark ? { rotate: 0 } : { rotate: 180 }}
          transition={{ duration: 0.5 }}
          onClick={() => setMark(!mark)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="flex-1 min-h-screen"
        animate={!mark ? { marginLeft: 200 } : { marginLeft: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          key={st}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {st === 0 && <Home />}
          {st === 1 && <Profile />}
          {st === 2 && <Games />}
          {st === 3 && <Responsible />}
          {st === 4 && <Ranking />}
          {st === 5 && <Chat />}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default Page;