"use client";

import { useEffect, useRef } from "react";
import styles from "./snake.module.css";
import { api } from "@/lib/axios";
import { updateScore } from "../actions";

export default function SnakePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const foodRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const gameoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const food = foodRef.current!;
    const score = scoreRef.current!;
    const Gameover = gameoverRef.current!;

    const func = [1, 1, -1, -1];
    let body = container.children as HTMLCollectionOf<HTMLElement>;

    let len = body.length;
    let run: any = null;
    let collision: any = null;
    let sc = 0;

    let pos = [[0, 0], [0, 0], [0, 0]];
    let respon = [[0], [0], [0]];
    let ob = [[], [], []] as number[][][];

    function createFood() {
      let x = Math.floor(Math.random() * 950);
      let y = Math.floor(Math.random() * 420);
      food.style.left = `${25 * Math.floor(x / 25)}px`;
      food.style.top = `${25 * Math.floor(y / 25)}px`;
    }

    function update() {
      const p = body[0].getBoundingClientRect();
      const div = document.createElement("div");

      let res = respon[0][0];
      let x = res & 1 ? p.x - 25 * func[res] : p.x;
      let y = res & 1 ? p.y : p.y - 25 * func[res];

      pos.unshift([x, y]);
      respon.unshift([...respon[0]]);
      ob.unshift([...ob[0]]);

      div.style.transform = `translate(${x}px, ${y}px)`;
      container.prepend(div);

      body = container.children as HTMLCollectionOf<HTMLElement>;
      len++;
      sc++;
    }

    async function gameover() {
        Gameover.style.zIndex = "9999";
        clearInterval(run);
        clearInterval(collision);
        await updateScore(sc, 2);
    }

    function checkCollision() {
      const head = body[len - 1].getBoundingClientRect();

      if (head.x < 0 || head.y < 0 || head.x > 980 || head.y > 750) {
        gameover();
        
      }

      for (let i = 0; i < len - 1; i++) {
        const b = body[i].getBoundingClientRect();
        if (Math.floor(head.x) === Math.floor(b.x) &&
            Math.floor(head.y) === Math.floor(b.y)) {
          gameover();
          break;
        }
      }

      const f = food.getBoundingClientRect();
      if (head.x === f.x && head.y === f.y) {
        createFood();
        update();
      }
    }

    createFood();

    const scoreTimer = setInterval(() => {
      score.innerHTML = `Your Score: ${sc}`;
    }, 16);

    collision = setInterval(checkCollision, 5);

    run = setInterval(() => {
      for (let i = len - 1; i >= 0; i--) {
        let locate = body[i].getBoundingClientRect();
        if (ob[i].length > 0 && Math.floor(locate.x) == Math.floor(ob[i][0][0])
            && Math.floor(locate.y) == Math.floor(ob[i][0][1])) {
            respon[i].shift();
            ob[i].shift();
        }     

        let r = respon[i][0];
        if (r & 1) pos[i][0] += 25 * func[r];
        else pos[i][1] += 25 * func[r];

        body[i].style.transform = `translate(${pos[i][0]}px, ${pos[i][1]}px)`;
      }
    }, 100);

    const handleKey = (e: KeyboardEvent) => {
      let res = -1;
      if (e.key === "s") res = 0;
      if (e.key === "d") res = 1;
      if (e.key === "w") res = 2;
      if (e.key === "a") res = 3;

      if (res !== -1) {
        const locate = body[len - 1].getBoundingClientRect();
        for (let i = 0; i < len; i++) {
          respon[i].push(res);
          ob[i].push([locate.x, locate.y]);
        }
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(run);
      clearInterval(collision);
      clearInterval(scoreTimer);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className={styles.boss}>
      <div className={styles.score} ref={scoreRef} />
      <div className={styles.gameover} ref={gameoverRef}>Game Over</div>
      <div className={styles.food} ref={foodRef} />

      <section className={styles.container} ref={containerRef}>
        <div style={{ top: "0px" }} />
        <div style={{ top: "25px" }} />
        <div style={{ top: "50px", backgroundColor: "lime" }} />
      </section>
    </div>
  );
}
