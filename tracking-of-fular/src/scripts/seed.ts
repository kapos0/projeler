import connectDB from "../lib/db";
import { Board, Column, Fular } from "../lib/models";

const userId = process.env.SEED_USER_ID;

if (!userId) {
    throw new Error("SEED_USER_ID must be set in .env.local before seeding.");
}

const samples = [
    {
        title: "Kürk Mantolu Madonna",
        creator: "Sabahattin Ali",
        category: "Roman",
        description:
            "Raif Efendi'nin iç dünyasına açılan etkileyici bir klasik.",
        tags: ["klasik", "türk edebiyatı"],
        column: "Okumak istiyorum",
    },
    {
        title: "Atomik Alışkanlıklar",
        creator: "James Clear",
        category: "Kişisel gelişim",
        description: "Küçük alışkanlıklarla kalıcı değişim kurmak için.",
        tags: ["alışkanlık", "üretkenlik"],
        column: "Okuyorum",
    },
    {
        title: "Dune",
        creator: "Frank Herbert",
        category: "Bilim kurgu",
        description: "Uzun zamandır ertelediğim, evreni geniş bir seri.",
        tags: ["bilim kurgu", "seri"],
        column: "Okudum",
        rating: "5",
    },
];

async function seed() {
    await connectDB();
    const board =
        (await Board.findOne({ userId, name: "Fular" })) ??
        (await Board.create({ userId, name: "Fular", columns: [] }));

    const defaultColumns = [
        "Planlandı",
        "Devam ediyor",
        "Tamamlandı",
        "Arşiv",
    ];
    const columns = [];
    for (const [order, name] of defaultColumns.entries()) {
        const column =
            (await Column.findOne({ boardId: board._id, name })) ??
            (await Column.create({
                boardId: board._id,
                name,
                order,
                fulars: [],
            }));
        columns.push(column);
    }
    board.columns = columns.map((column) => column._id);
    await board.save();

    for (const [order, sample] of samples.entries()) {
        const column = columns.find((item) => item.name === sample.column);
        if (!column) continue;
        await Fular.updateOne(
            {
                userId,
                boardId: board._id,
                title: sample.title,
                creator: sample.creator,
            },
            {
                $setOnInsert: {
                    ...sample,
                    columnId: column._id,
                    boardId: board._id,
                    userId,
                    order,
                },
            },
            { upsert: true },
        );
    }

    console.log(`Seeded ${samples.length} fulars for user ${userId}.`);
    process.exit(0);
}

seed().catch((error) => {
    console.error("Fular seed failed:", error);
    process.exitCode = 1;
});
