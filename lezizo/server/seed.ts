import { recipesCollection, type RecipeDocument } from "./db";

const seedRecipes: RecipeDocument[] = [
  {
    title: "Köz Patlıcanlı Shakshuka",
    category: "Akşam",
    time: "35 dk",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    author: "Lezizo mutfağı",
    description:
      "Közlenmiş patlıcanın isli lezzeti, domatesin tazeliği ve yumurtanın yumuşak dokusuyla tek tavada hazırlanan nefis bir sofra klasiği.",
    ingredients: [
      "2 adet patlıcan",
      "3 adet domates",
      "1 adet kapya biber",
      "2 diş sarımsak",
      "4 adet yumurta",
    ],
    ingredientKeys: [
      "patlıcan",
      "domates",
      "kapya biber",
      "sarımsak",
      "yumurta",
    ],
    instructions:
      "Patlıcanları közleyip kabuklarını soyun ve iri iri doğrayın. Tavada zeytinyağıyla soğan, kapya biber ve sarımsağı yumuşayana kadar soteleyin. Domatesleri ve baharatları ekleyip sos koyulaşana kadar pişirin. Köz patlıcanları tavaya alıp karıştırın, ardından dört yuva açarak yumurtaları kırın. Kapağı kapatıp yumurtaların beyazları pişene kadar yaklaşık 5 dakika bekletin ve sıcak servis edin.",
    nutrition: [
      { label: "Protein", value: "18 g", percent: 42, color: "#e7a24e" },
      { label: "Karbonhidrat", value: "28 g", percent: 62, color: "#7a9b70" },
      { label: "Yağ", value: "14 g", percent: 35, color: "#c75d4d" },
    ],
    createdAt: new Date(),
  },
];

const collection = await recipesCollection();
await collection.deleteMany({});
await collection.insertMany(seedRecipes);
console.log(`Seeded ${seedRecipes.length} recipes.`);
process.exit(0);
