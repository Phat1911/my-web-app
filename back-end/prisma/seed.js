import { prisma } from "../src/config/db.js";

const games = [
    {
        title: "Space rocket",
        image: "https://cf.geekdo-images.com/V9TCGOguxWnFkb43q-T3fQ__itemrep/img/l61t9tnw93KGlEgD-29z9PGnY-0=/fit-in/246x300/filters:strip_icc()/pic6608652.jpg",
        value: 0.2,
    },

    {
        title: "Snake Game",
        image: "https://www.coolmathgames.com/sites/default/files/Snake_OG-logo.jpg",
        value: 0.1,
    },

    {
        title: "Car Game",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Purple3/v4/92/f4/1a/92f41a31-8ba5-4d6e-b1da-460de919016d/source/512x512bb.jpg",
        value: 0.3,
    },

    {
        title: "Flappy Bird",
        image: "https://media.vneconomy.vn/images/upload/2021/04/21/Flappy-Bird33167.jpg",
        value: 0.4,
    }
]

const main = async () => {
    console.log("Seeding games...");

    for (const g of games) {
        await prisma.game.create({
            data: g,
        });
    }
    console.log("Seeding complete");
}

main()
.catch((err) => {
    console.error(err);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})