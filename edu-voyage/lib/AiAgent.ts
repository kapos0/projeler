import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
if (!apiKey) throw new Error("API key is required");
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const GenerateTopicsAI = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Learn Python::As you are coaching teacher\n    - User want to learn about the topic\n    - Generate 5-7 Course title for study (Short)\n    - Make sure it is releated to description\n    - Output will be ARRAY of String in JSON FORMAT only\n    - Do not add any plain text in output,\n",
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '```json\n[\n    "Python Basics: Getting Started",\n    "Data Structures in Python",\n    "Python for Data Analysis",\n    "Object-Oriented Programming (OOP) with Python",\n    "Web Development with Python (Flask/Django)",\n    "Python Automation and Scripting",\n    "Machine Learning with Python"\n]\n```\n',
                },
            ],
        },
    ],
});

export const GenerateCourseAI = model.startChat({
    generationConfig,
    history: [],
});
