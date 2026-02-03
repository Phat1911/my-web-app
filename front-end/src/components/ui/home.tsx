"use client";
import { useEffect, useRef } from "react";
import styles from "./home.module.css";
import gsap from "gsap";

const Home = () => {
  const contentRef = useRef <HTMLDivElement | null> (null);
  const circleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const content = contentRef.current!;
    const circle = circleRef.current!;
    let l = 0, deg = -360, time = 0, run = null, run1 = null, step = -290;
    let tl = gsap.timeline(), tl1 = gsap.timeline();

    for (let i = 0; i < 21; i++) {
        const item = document.createElement("div");
        const img = document.createElement("img");

        img.src = `my_evolution_assets/p1 (${i}).jpg`;

        item.append(img); 
        item.style.left = `${l}px`;
        content.append(item);
        l += 290;
    }

    run = setInterval(() => {
        tl.to(circle, {
            duration: 1.5,
            ease: "linear",
            rotate: deg,
        })
        deg -= 360; time = 2000;
    }, time)

    run = setInterval(() => {
        tl1.to(content.children, {
            duration: 1.5,
            ease: "linear",
            x: step,
        });
        step -= 290;
    }, 2000);

    setInterval(() => {
        let pos = content.children[0].getBoundingClientRect();
        if (Math.floor(pos.left) <= -89) {
            const item = content.children[0].cloneNode(true) as HTMLDivElement;
            content.children[0].remove();
            item.style.left = `${l}px`;
            content.append(item);
            l += 290;
        }
    }, 5); 

    return () => {
      clearInterval(run);
    }
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.intro}>
        <div className={styles.box}>
          <div className={styles.circle} ref={circleRef} />
          <div className={styles.content} ref={contentRef}></div>
        </div>

        <div className="ml-[20px] flex flex-col justify-around">
          <p>Author: Trần Đình Hồng Phát</p>
          <p>Age: 18</p> 
          <p>Job: First-year IT student</p>
          <p>Github: <a href="https://github.com/Phat1911" className="underline text-blue-500">https://github.com/Phat1911</a></p>
          <p>Facebook: <a href="https://www.facebook.com/profile.php?id=100090521350628" className="underline text-blue-500">Hồng Phát</a></p>
          <p>Contact: 0764717493</p>
        </div>
      </div>

      <div className="mt-[20px] text-[1.3rem] p-[0px_120px]">
        Hello my beautiful user! <br /> <br />
        In this web app, you will complete tasks (playing games in the Games section to earn a certain number of 
        points), which you will receive from the Responsible section every hour (since you logged in). <br /> <br />
        Completing a task will earn you 10 points. Besides completing tasks, you can also play games in the Games 
        section to accumulate more points. The points you earn from playing those games (not part of assigned tasks)
        will be your value * score. If you accumulate many points, you will be displayed on the leaderboard and become a top player <br /> <br />
        Snake game, Flappy Bird, Car Game: using the arrow keyboard to adjust the direction.  <br />
        Space game: using the arrow left and arrow right to adjust the rotation of rocket. Use the 's' key to move forward, use the 'd' key to shoot
      </div>

    </section>

  )
}

export default Home