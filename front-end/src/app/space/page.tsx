"use client";

import { useEffect, useRef } from "react";
import styles from "./space.module.css";
import { updateScore } from "../actions";

const Space = () => {
    const gameRef = useRef <HTMLDivElement | null> (null);
    const mainRef = useRef <HTMLDivElement | null> (null);
    const enemy1Ref = useRef <HTMLDivElement | null> (null);
    const enemy2Ref = useRef <HTMLDivElement | null> (null);
    const centerRef = useRef <HTMLDivElement | null> (null);
    const scoreRef = useRef <HTMLDivElement | null> (null);
    const bloodRef = useRef <HTMLDivElement | null> (null);
    const gameoverRef = useRef <HTMLDivElement | null> (null);


    useEffect(() => {
        document.body.style.overflow = "hidden";
        const game = gameRef.current!;
        const main = mainRef.current!;
        const enemy1 = enemy1Ref.current!;
        const enemy2 = enemy2Ref.current!;
        const center = centerRef.current!;
        const score = scoreRef.current!;
        const blood = bloodRef.current!;
        const sound = document.querySelectorAll("audio")
        const gameover = gameoverRef.current!;
        const enemies = [enemy1, enemy2];

        let play: any = null, rot: any = null, run: any = null, bulletRun = null, degree = -45, step = 10, numOfEnemy = 1;
        let x = 0, y = 0, sc = 0, left = 2, degLeft = 45, collision: any = null, deg = [45, -135], st = [0, 0];

        for (let i = 0; i < 4; i++) {
            const div = document.createElement("div")
            div.style.left = `${left}px`;
            blood.append(div);
            left += 48;
        }
        update();

        function update() {
            main.style.transform = `translate(${x}px, ${y}px) rotate(${degree}deg)`
        }

        async function changeIn4() {
            let del = blood.lastChild as HTMLDivElement;
            if (blood.children.length > 1) {
                del.style.transform = "translateX(-50px)"
                setTimeout(() => del.remove(), 1040)
            } else {
                del.remove();
                const img = mainRef.current?.querySelector("img") as HTMLImageElement | null;
                if (img) {
                    img.src = "/space_game_assets/boom.png"; 
                }
                setTimeout(() => {
                    gameover.style.zIndex = "9999";
                    const boom = sound[2].cloneNode(true) as HTMLAudioElement;
                    boom.play();
                }, 150)
                clearInterval(play); clearInterval(collision);
                await updateScore(sc, 1);
            }
        }

        function createEnemy(x: number, y: number, pos: number) {
            const enemy = document.createElement("img")
            const div = document.createElement("div")
            const enemyBlood = document.createElement("div")
            enemyBlood.classList.add("blood")
            enemyBlood.style.width = "52px";
            enemyBlood.style.height = "5px";
            enemyBlood.style.border = "0.5px solid white";
            enemyBlood.style.display = "flex";
            enemyBlood.style.position = "relative";
            
            let push = 1;
            for (let i = 0; i < 4; i++) {
                const tmp = document.createElement("div")
                tmp.style.top = `2px`;
                tmp.style.left = `${push}px`;
                tmp.style.background = `red`;
                tmp.style.transition = `1s linear`;
                tmp.style.position = `absolute`;
                tmp.style.alignItems = `center`;

                enemyBlood.append(tmp);
                push += 12;
            }

            enemy.src = "space_game_assets/rocket.png"
            enemy.style.transform = `rotate(${deg[pos]}deg)`
            div.append(enemy); div.append(enemyBlood);
            div.style.position = "absolute"
            div.style.transform = `translate(${x}px, ${y}px)`
            div.classList.add("rocket")
            enemies[pos].prepend(div);
        }

        function gamePlay() {
            st[0] += 10; st[1] -= 10;
            if (st[0] == 10) {        
                for (let i = 0; i < numOfEnemy; i++) {
                    let x = Math.random() * 950;
                    let y = Math.random() * 420;
                    let pos = Math.floor(Math.random() * 2);
                    createEnemy(x, y, pos);
                }
            }
            if (st[0] > 2060) {
                numOfEnemy++;
                const imgs = game.querySelectorAll(".rocket");        
                imgs.forEach(img => img.remove());

                for (let i = 0; i < 2; i++) {
                    enemies[i].style.transition = "0s all";
                    enemies[i].style.transform = "translateX(0px)"
                    st[i] = 0;
                }
            }
            if (!st[0]) return;
            for (let i = 0; i < 2; i++) {
                enemies[i].style.transition = "50ms linear";
                enemies[i].style.transform = `translateX(${st[i]}px)`;
            }
        }

        function checkCollision() {
            const rockets = game.querySelectorAll(".rocket")

            let playerPos = main.getBoundingClientRect();
            for (let element of rockets) {
                const e = element as HTMLDivElement;
                let enemyPos = e.getBoundingClientRect();
                // player vs rocket
                let check1 = !(
                    playerPos.bottom < enemyPos.top + 20|| 
                    playerPos.top > enemyPos.bottom - 20 ||
                    playerPos.right < enemyPos.left + 20 ||
                    playerPos.left > enemyPos.right - 20
                )
                if (check1) {
                    sound[0].play(); 
                    changeIn4();
                }
                // rocket vs bullet
                let bullets = main.querySelectorAll(".bullet");
                for (let bull of bullets) {
                    if (bull == null) break;
                    let bulletPos = bull.getBoundingClientRect();
                    let check2 = !(
                        bulletPos.bottom < enemyPos.top || 
                        bulletPos.top > enemyPos.bottom ||
                        bulletPos.right < enemyPos.left ||
                        bulletPos.left > enemyPos.right
                    )
                    if (check2) {
                        bull.remove();
                        const lastElement = e.lastElementChild;
                        if (!lastElement) return;

                        // remove last child element bên trong
                        const innerLast = lastElement.lastElementChild;
                        innerLast?.remove();
                        if (!lastElement) continue;
                        if (lastElement.children.length == 0) {
                            lastElement.remove();

                            const img = e.children[0] as HTMLImageElement | undefined;
                            if (img) {
                                img.src = "/space_game_assets/boom.png";
                            }

                            e.style.transform = `translate(${enemyPos.x}px, ${enemyPos.y}px)`;

                            setTimeout(() => {
                                const boom = sound[2].cloneNode(true) as HTMLAudioElement;
                                boom.play();
                            }, 150);
                            setTimeout(() => e.remove(), 500);
                            clearInterval(play);
                            setTimeout(() => play = setInterval(gamePlay, 80), 500);
                            sc++;
                        }
                        break;
                    }
                }
            }
        }
        setInterval(() => score.innerText = `Your Score: ${sc}`, 2)
        play = setInterval(gamePlay, 80)
        collision = setInterval(checkCollision, 2)

        window.addEventListener("keydown", (e) => {
            if (["ArrowRight", "ArrowLeft"].includes(e.key)) e.preventDefault();
            if (e.key == "ArrowRight" && rot == null) {
                rot = setInterval(() => {
                    degree += 15;
                    update();
                }, 35)
            }

            if (e.key == "ArrowLeft" && rot == null) {
                rot = setInterval(() => {
                    degree -= 15;
                    update();
                }, 35)
            }

            if (e.key == "s" && run == null) {
                (main.children[0] as HTMLImageElement).src = "space_game_assets/plane_speed.png"
                run = setInterval(() => {
                    let rand = (degree + 45) * Math.PI / 180;
                    x += Math.sin(rand) * step;
                    y -= Math.cos(rand) * step;
                    update();
                }, 45)
            } 
        })

        window.addEventListener("keyup", (e) => {
            if (e.key == "d") {
                const s = sound[1].cloneNode(true) as HTMLAudioElement; s.play();
                const bullet = document.createElement("div");
                bullet.classList.add("bullet");
                bullet.style.backgroundColor = "white";
                bullet.style.width = "5px";
                bullet.style.height = "5px";
                bullet.style.zIndex = "999";
                bullet.style.borderRadius = "100%";
                bullet.style.position = "absolute";
                bullet.style.top = "0px";
                bullet.style.left = "45px";
                bullet.style.transition = "1s linear";

                main.append(bullet);
                setTimeout(() => bullet.style.transform = "translate(1000px, -1000px)", 5)
            }

            if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
                clearInterval(rot);
                rot = null;
            }

            if (e.key == "s") {
                (main.children[0] as HTMLImageElement).src = "space_game_assets/plane.png"
                clearInterval(run);
                run = null;
            }
        })

    }, []);

    return (
        <div className="body">
            <audio src="space_game_assets/hit.mp3"></audio>
            <audio src="space_game_assets/gun.mp3"></audio>
            <audio src="space_game_assets/explode.mp3"></audio>

            <div className={styles.in4}>
                <h2 className={styles.Score} ref={scoreRef}></h2>
                <div className={styles.blood} ref={bloodRef}></div>
            </div>

            <div className={styles.gameover} ref={gameoverRef}> <h1>Game Over</h1> </div>

            <div className={styles.game} ref={gameRef}>
                <section className={`${styles.left} ${styles.section}`} ref={enemy1Ref}></section>
                <section className={`${styles.cemter} ${styles.section}`} ref={centerRef}>
                    <div className={styles.player} ref={mainRef}>
                        <img src="space_game_assets/plane.png" alt="" /> 
                    </div>
                </section>
                <section className={`${styles.right} ${styles.section}`} ref={enemy2Ref}></section>
            </div>
        </div>
    )
}

export default Space