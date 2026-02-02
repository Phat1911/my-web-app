"use client";

import { useEffect, useRef } from "react";
import styles from "./flappy.module.css";
import { updateScore } from "../actions";

const FlappyBird = () => {
    const containerRef = useRef <HTMLDivElement | null> (null);
    const scoreRef = useRef <HTMLDivElement | null> (null);
    const gameoverRef = useRef <HTMLDivElement | null> (null);
    const birdRef = useRef <HTMLImageElement | null> (null);
    const soundRef = useRef <HTMLDivElement | null> (null);
    const divRef = useRef <HTMLDivElement | null> (null);

    useEffect(() => {
        const container = containerRef.current!;
        const score = scoreRef.current!;
        const Gameover = gameoverRef.current!;
        const bird = birdRef.current!;
        const sound = document.querySelectorAll("audio")
        const div = divRef.current!;
        const mark = new Map();

        let x = 2300, y = 0, degree = 0, sc = 0, end = 0, vel = 0, numOfPipe = 1;
        let screen = container.children as HTMLCollectionOf<HTMLElement>, down: any = null, collision: any = null, scoreRun: any = null, run: any = null;

        function update() {
            bird.style.transform = `translateY(${y}px) rotate(${degree}deg)`
        }

        async function gameover() {
            sound[1].play();
            Gameover.textContent = "Game Over"
            // Gameover.style.transform = "translate(310px, 170px)";
            Gameover.style.zIndex = "9999";
            clearInterval(down);
            clearInterval(collision);
            clearInterval(run);
            run = null; end = 1;
            await updateScore(sc, 4);
        }

        function updateStatus(deg: number) {
            degree = deg;
            let rad = degree * Math.PI / 180;
            y += 15 * deg / Math.abs(deg);
            if (deg < 0) y -= 40;
            update();
        }

        function checkCollision() {
            const posBird = bird.getBoundingClientRect();
            //bird vs ground and top
            let collied = !(posBird.top > 10 && posBird.bottom < 470);
            if (collied) {
                gameover();
                return;
            }
            //bird vs pipe
            const pipes = container.querySelectorAll(".pipe");    
            for (let i = 0; i < pipes.length; i++) {                        
                let posPipe = pipes[i].getBoundingClientRect();
                collied = !(
                    posBird.top > posPipe.bottom || 
                    posBird.bottom < posPipe.top ||
                    posBird.left > posPipe.right ||
                    posBird.right < posPipe.left
                );

                if (collied) {
                    gameover();
                    break;
                } else if (Math.floor(posBird.left) > Math.floor(posPipe.right) && mark.get(i) == 1) {  
                    console.log(i, mark.get(i));
                    sc++; mark.set(i, 0);
                    sound[2].currentTime = 0;
                    sound[2].play();
                }
            }
        }

        function createPipe() {
            numOfPipe++;
            let kc = Math.floor((950 - numOfPipe * 50) / (numOfPipe - 1));
            let push = 100;
            for (let i = 0; i < numOfPipe; i++) {
                let h1 = Math.floor(Math.random() * 350);
                let h2 = 380 - h1;
                let pipe = document.createElement("img");

                pipe.classList.add("pipe");
                pipe.style.position = "absolute";
                pipe.style.width = "50px";
                pipe.style.zIndex = "9999";
                pipe.src = "flappy_bird_assets/pipe_top.png";
                pipe.style.position = "absolute";
                pipe.style.height = `${h1}px`;
                pipe.style.left = `${push}px`;
                pipe.style.top = `0px`;
                screen[1].append(pipe);

                const pipe1 = pipe.cloneNode(true) as HTMLImageElement;
                pipe1.src = "flappy_bird_assets/pipe_bottom.png";
                pipe1.style.top = `${500 - h2}px`;
                pipe1.style.height = `${h2}px`;
                screen[1].append(pipe1);

                push += kc + 50; 
            }   
            const posBird = bird.getBoundingClientRect();
            const pipes = container.querySelectorAll(".pipe");
            for (let i = 0; i < pipes.length; i += 2) {
                let posPipe = pipes[i].getBoundingClientRect();
                mark.set(i, 0), mark.set(i+1, 0);
                if (posPipe.left > posBird.right) mark.set(i, 1);
            }
        }

        function gamePlay() {
            vel -= 10;
            if (vel % 1160 == 0) {        
                const d = div.cloneNode(true) as HTMLDivElement;
                d.style.left = `${x}px`;
                container.children[0].remove();
                container.append(d);
                x += 1150; createPipe();
            } else container.style.transform = `translateX(${vel}px)`;
        }

        scoreRun = setInterval(() => score.innerHTML = `Your Score: ${sc}`, 3)
        collision = setInterval(checkCollision, 20);

        const handleKey1 = (e: KeyboardEvent) => {
            if ([" ", "ArrowRight"].includes(e.key)) e.preventDefault();
            if (e.key == " " && !end) {
                Gameover.style.zIndex = "-1";
                sound[0].currentTime = 0;
                sound[0].play();
                updateStatus(-45);
                clearInterval(down);
                down = null; 
                if (run == null) run = setInterval(gamePlay, 50);
            }
        }

        const handleKey2 = (e: KeyboardEvent) => {
            if (e.key == " " && down == null && !end) {
                down = setInterval(() => updateStatus(45), 50);
            }
        }   

        window.addEventListener("keydown", handleKey1);
        window.addEventListener("keyup", handleKey2);

        return () => {
            clearInterval(scoreRun);
            clearInterval(collision);
            clearInterval(run);
            window.removeEventListener("keydown", handleKey1);
            window.removeEventListener("keyup", handleKey2);
        }
    }, []);

    return (
        <div className={styles.boss}>
            <audio src="flappy_bird_assets/swoosh.wav"></audio>
            <audio src="flappy_bird_assets/hit.wav"></audio>
            <audio src="flappy_bird_assets/point.wav"></audio>
            <div ref={scoreRef} className={styles.score}></div>
            <div ref={gameoverRef} className={styles.gameover}>
                Press space to play
            </div>
            <img ref={birdRef} className={styles.bird} src="flappy_bird_assets/bird.png" alt="" />
            <img src="flappy_bird_assets/background.png" className="absolute w-[700px] h-[410px] left-[418px] top-0 left-0" alt="" />
            <div className="flex flex-col items-center">
                <div className={`${styles.parent} ${styles.container}`}>
                    <section ref={containerRef} className={styles.container}>
                        <div ref={divRef}><img src="flappy_bird_assets/background.png" alt=""/></div>
                        <div style={{left: "1150px"}}><img src="flappy_bird_assets/background.png" alt=""/></div>
                    </section>
                </div>
                <img className="w-[700px] h-[275px]" src="flappy_bird_assets/ground.png" alt="" width="1050px"></img>
            </div>
        </div>
    )
}

export default FlappyBird