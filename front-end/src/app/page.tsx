"use client";

import { Button } from "@/components/ui/button"
import Games from "@/components/ui/games";
import Home from "@/components/ui/home";
import Profile from "@/components/ui/profile";
import Responsible from "@/components/ui/responsible";
import Link from "next/link"
import { useState } from "react"
import { motion } from "motion/react"
import Ranking from "@/components/ui/ranking";

const page = () => {
  const [st, setSt] = useState <number> (0);
  const [mark, setMark] = useState <boolean> (false);

  return (
    <div className="flex items-center bg-[#1A1A1A] space-x-2 ">
      <motion.div 
        className="bg-[#1A1A1A] space-x-2 h-screen flex items-center justify-between w-[150px] text-white font-bold pt-[10px]"
        animate={ !mark ? {
          x: 0,
        } : {
          x: -120,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <ul className="space-y-2 bg-black h-screen flex flex-col items-start w-full w-[150px]">
          <Button
            className={`cursor-pointer bg-transparent hover:bg-transparent
              ${st === 0 ? "underline underline-offset-4 text-white" : "text-gray-400"}
            `}
            onClick={() => setSt(0)}
          >
            Home
          </Button>

          <Button
            className={`cursor-pointer bg-transparent hover:bg-transparent
              ${st === 1 ? "underline underline-offset-4 text-white" : "text-gray-400"}
            `}
            onClick={() => setSt(1)}
          >
            Profile
          </Button>

          <Button
            className={`cursor-pointer bg-transparent hover:bg-transparent
              ${st === 2 ? "underline underline-offset-4 text-white" : "text-gray-400"}
            `}
            onClick={() => setSt(2)}
          >
            Games
          </Button>

          <Button
            className={`cursor-pointer bg-transparent hover:bg-transparent
              ${st === 3 ? "underline underline-offset-4 text-white" : "text-gray-400"}
            `}
            onClick={() => setSt(3)}
          >
            Responsible
          </Button>

          <Button
            className={`cursor-pointer bg-transparent hover:bg-transparent
              ${st === 4 ? "underline underline-offset-4 text-white" : "text-gray-400"}
            `}
            onClick={() => setSt(4)}
          >
            Ranking
          </Button>

        </ul>

        <motion.div className="rounded-full bg-gray-200 flex justify-center items-center h-[30px] text-black p-[10px] cursor-pointer"
          animate={ !mark ? {rotate: 0} : {rotate: -180} }
          transition={{duration: 0.8}}
          onClick={() => setMark(!mark)}
        >{"<"}</motion.div>
      </motion.div>

      <div className="bg-black w-screen h-screen">
        { st === 0 && <Home /> }
        { st === 1 && <Profile /> }
        { st === 2 && <Games /> }
        { st === 3 && <Responsible /> }
        { st === 4 && <Ranking /> }
      </div>
    </div>
  )
}

export default page