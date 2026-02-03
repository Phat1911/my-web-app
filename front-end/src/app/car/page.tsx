"use client";

import { useEffect, useRef } from "react";
import styles from "./car.module.css";
import { updateScore } from "../actions";

const Car = () => {
    const btnRef = useRef <HTMLButtonElement | null> (null);
    const carRef = useRef <HTMLImageElement | null> (null);
    const timerRef = useRef <HTMLDivElement | null> (null);
    const containerRef = useRef <HTMLDivElement | null> (null);
    const roadRef = useRef <HTMLDivElement | null> (null);
    const screenRef = useRef <HTMLDivElement | null> (null);
    const gameoverRef = useRef <HTMLDivElement | null> (null);
    const centerRef = useRef <HTMLDivElement | null> (null);
    const sectionRef = useRef <HTMLDivElement | null> (null);

    useEffect(() => {
        const btn = btnRef.current!;
        const car = carRef.current!;
        const timer = timerRef.current!;
        const container = containerRef.current!;
        const road = roadRef.current!;
        const screen = screenRef.current!;
        const gameover = gameoverRef.current!;
        const center = centerRef.current!;
        const del = document.querySelectorAll(".del")
        const section = sectionRef.current!;
        
        const clock = timer.children as HTMLCollectionOf<HTMLElement>;
        let obtacle = -1, counter: any, run: any, enemyAttach: any, collision: any, flag = false;
        let hour = [0, 0], minute = [0, 0], second = [0, -1];
        let newS = screen.cloneNode(true) as HTMLDivElement, st = [0, 0, 0], rand = [0, 0, 0];
        let pos = [0, 0, 0, 0];

        container.append(newS);
        newS = screen.cloneNode(true) as HTMLDivElement;
        container.append(newS);
        const child = container.children as HTMLCollectionOf <HTMLElement>;

        function plus (time: number[]) {
            time[1]++;
            if (time[1] == 10) {
                time[1] = 0;
                time[0]++;
            }
        }
        function runClock() {
            plus(second);
            if (second[0] == 6) {
                plus(minute);
                second = [0, 0];
            }
            if (minute[0] == 6) {
                plus(hour);
                minute = [0, 0];
            }
            clock[0].innerText = `${hour[0]}${hour[1]}:`
            clock[1].innerText = `${minute[0]}${minute[1]}:`
            clock[2].innerText = `${second[0]}${second[1]}`
        }
        function play() {
            let vel = 17;
            let flag;
            for (let i = 0; i < 3; i++) st[i] += vel;
            if (st[0] > 1200) {
                st[0] = -590; flag = 0; obtacle = 0;
                child[0].style.transition = "0s all"
                child[0].style.transform = "translateY(-590px)"
            }
            if (st[1] > 600) {
                st[1] = -1190; flag = 1; obtacle = 1; 
                child[1].style.transition = "0s all"
                child[1].style.transform = "translateY(-1190px)"
            }
            if (st[2] > 0) {
                st[2] = -1790; flag = 2; obtacle = 2; 
                child[2].style.transition = "0s all"
                child[2].style.transform = "translateY(-1790px)"
            }
            if (obtacle != -1) {
                const imgs = child[obtacle].querySelectorAll("img")
                imgs.forEach(img => img.remove())
                enemy(); 
                obtacle = -1;
            }
            for (let i = 0; i < 3; i++) {
                if (i == flag) continue;
                child[i].style.transition = "40ms linear";
                child[i].style.transform = `translateY(${st[i]}px)`
            }
        }
        function enemy () {
            rand[0] = Math.floor(Math.random() * 2);
            for (let i = 1; i < 3; i++) rand[i] = Math.floor(Math.random() * 3);
            if (!rand[0]) {
                const img = document.createElement("img")
                img.classList.add("img")
                img.src = `car_game_assets/gamecar${rand[2] + 1}.png`
                child[obtacle].children[rand[1]].prepend(img);
            } else {
                const img1 = document.createElement("img")
                const img2 = document.createElement("img")
                img1.classList.add("img")
                img2.classList.add("img")
                let rand1 = Math.floor(Math.random() * 3);
                let rand2 = Math.floor(Math.random() * 3);
                img1.src = `car_game_assets/gamecar${rand1 + 1}.png`
                img2.src = `car_game_assets/gamecar${rand2 + 1}.png`
                child[obtacle].children[rand[1]].prepend(img1);
                if (rand[1] != rand[2]) child[obtacle].children[rand[2]].prepend(img2);
            }
        }   
        async function gameOver() {
            flag = false; 

            clearInterval(collision); 
            clearInterval(counter);
            clearInterval(run);
            
            timer.style.display = "none"
            gameover.style.display = "flex";
            gameover.innerHTML = 
            `<h1> Game Over </h1>
            <div> Your Time: 
            ${hour[0]}${hour[1]}:${minute[0]}${minute[1]}:${second[0]}${second[1]}</div>`

            const h = hour[0] * 10 + hour[1], m = minute[0] * 10 + minute[1], s = second[0] * 10 + second[1];
            const sc: number = h * 60 + m + s / 60;
            await updateScore(sc, 3);
        }
        function checkCollision() {
            const carPos = car.getBoundingClientRect();
            const containerPos = container.getBoundingClientRect();
            let enemies = container.querySelectorAll("img")

            for (let enemy of enemies) {
                let enemyPos = enemy.getBoundingClientRect();

                let check = !(
                    (carPos.left > enemyPos.right - 15 ||
                    carPos.right < enemyPos.left + 23 || 
                    carPos.top > enemyPos.bottom - 20 || 
                    carPos.bottom < enemyPos.top + 20) 
                    && (carPos.left > containerPos.left && carPos.right < containerPos.right + 2) 
                )
                if (check) {
                    gameOver();
                    break;
                }
            }
        }
        btn.addEventListener("click", () => {
            let curPos = 8;  flag = true;

            gameover.style.display = "none";
            btn.style.display = "none";
            car.style.transition = "1s all"
            car.style.transform = `translate(${curPos}px ,-200px)`;
            
            counter = setInterval(runClock, 1000);
            run = setInterval(play, 50);
            collision = setInterval(checkCollision, 5);
            
            window.addEventListener("keyup", (e) => {
                car.style.transition = "100ms all"
                if (e.key == "ArrowLeft" && flag == true) { 
                    curPos -= 97;
                    car.style.transform = `translate(${curPos}px,-250px)`;
                }
                if (e.key == "ArrowRight" && flag == true) { 
                    curPos += 97;
                    car.style.transform = `translate(${curPos}px,-250px)`;
                }
            })
        })
    }, []);

    return (
        <div className={styles.body}>
            <div className={styles.clock} ref={timerRef} >
                <div>00:</div>
                <div>00:</div>
                <div>00</div>
            </div>
            <div className={styles.gameover} ref={gameoverRef}>
            </div>
            <div className={styles.box} >
                <button className={styles.play} ref={btnRef}>Play</button>
                <img className={styles.car} ref={carRef} src="car_game_assets/gamecar4.png" alt="" />
            </div>
            <section className={styles.section} ref={sectionRef}>
                <div  className={styles.container} ref={containerRef}>
                    <div ref={screenRef}>
                        <div></div>
                        <div className={styles.center} ref={centerRef}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Car