import { MongoClient, type Collection, type Db } from "mongodb";
import "dotenv/config";

export type RecipeDocument = {
  title: string;
  category: string;
  time: string;
  rating: string;
  image: string;
  author: string;
  description: string;
  ingredients: string[];
  ingredientKeys: string[];
  instructions: string;
  nutrition: { label: string; value: string; percent: number; color: string }[];
  createdAt: Date;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is required to connect to MongoDB.");
}

const client = new MongoClient(uri);
let database: Db | undefined;

export async function recipesCollection(): Promise<Collection<RecipeDocument>> {
  database ??= (await client.connect()).db(process.env.MONGODB_DB ?? "lezizo");
  return database.collection<RecipeDocument>("recipes");
}

export async function getDatabase(): Promise<Db> {
  database ??= (await client.connect()).db(process.env.MONGODB_DB ?? "lezizo");
  return database;
}

export { client };
