import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
    { name: "Planlandı", order: 0 },
    { name: "Devam ediyor", order: 1 },
    { name: "Tamamlandı", order: 2 },
    { name: "Arşiv", order: 3 },
];

export default async function initUserBoard(userId: string) {
    await connectDB();
    const board = await Board.findOneAndUpdate(
        { userId, name: "Fularlar" },
        {
            $setOnInsert: {
                userId,
                name: "Fularlar",
                columns: [],
            },
        },
        { returnDocument: "after", upsert: true },
    );
    if (!board) {
        throw new Error("Fularlar board could not be initialized.");
    }

    const columns = await Promise.all(
        DEFAULT_COLUMNS.map(async (column) => {
            const existingColumn = await Column.findOneAndUpdate(
                { boardId: board._id, name: column.name },
                {
                    $setOnInsert: {
                        name: column.name,
                        order: column.order,
                        boardId: board._id,
                        fulars: [],
                    },
                },
                { returnDocument: "after", upsert: true },
            );
            if (!existingColumn) {
                throw new Error(
                    `Could not initialize column "${column.name}".`,
                );
            }
            return existingColumn;
        }),
    );

    await Board.updateOne(
        { _id: board._id, userId },
        {
            $addToSet: {
                columns: { $each: columns.map((column) => column._id) },
            },
        },
    );
    board.columns = columns.map((column) => column._id);
    return board;
}
