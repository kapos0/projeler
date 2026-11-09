export type Recipe = {
  id: number;
  title: string;
  category: string;
  time: string;
  rating: string;
  image: string;
  author: string;
  description: string;
  ingredients: string[];
  instructions: string;
  nutrition: { label: string; value: string; percent: number; color: string }[];
};

export type Nutrition = Recipe["nutrition"][number];
