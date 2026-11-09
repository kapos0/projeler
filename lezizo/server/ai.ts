import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

export async function askChef(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for the AI Chef.");
  }

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  const result = await model.generateContent(
    `Sen Lezizo'nun Türkçe konuşan AI şefisin. Kısa, sıcak ve uygulanabilir cevaplar ver. Kullanıcı: ${prompt}`,
  );
  return result.response.text();
}
