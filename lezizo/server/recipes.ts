import { recipesCollection, type RecipeDocument } from "./db";

function normalizeIngredient(value: string): string {
  return value.trim().toLocaleLowerCase("tr");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchRecipes(
  searchTerm: string,
): Promise<RecipeDocument[]> {
  const terms = searchTerm.split(",").map(normalizeIngredient).filter(Boolean);
  if (terms.length === 0)
    return (await recipesCollection()).find().sort({ createdAt: -1 }).toArray();

  const collection = await recipesCollection();
  return collection
    .find({
      $or: [
        { title: { $regex: escapeRegex(searchTerm.trim()), $options: "i" } },
        { ingredientKeys: { $all: terms } },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();
}
