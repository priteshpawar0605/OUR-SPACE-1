
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateCoupleQuiz = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 5 unique multiple-choice quiz questions for a couple to test how well they know each other. Questions should be fun and insightful. Provide the question, an array of 4 options, and the 0-based index of the correct answer.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER }
            },
            required: ["question", "options", "correctAnswerIndex"]
          }
        }
      }
    });
    
    const jsonString = response.text.trim();
    const questions = JSON.parse(jsonString);
    return questions;

  } catch (error) {
    console.error("Error generating couple quiz:", error);
    // Return fallback questions on error
    return [
      { question: "What is your partner's favorite movie?", options: ["The Notebook", "Star Wars", "The Godfather", "Pulp Fiction"], correctAnswerIndex: 0 },
      { question: "What is your partner's dream vacation spot?", options: ["Paris", "Bali", "Tokyo", "Maldives"], correctAnswerIndex: 1 },
      { question: "What is your partner's go-to comfort food?", options: ["Pizza", "Ice Cream", "Mac & Cheese", "Tacos"], correctAnswerIndex: 2 },
      { question: "What is your partner's biggest pet peeve?", options: ["Loud chewing", "Being late", "Leaving lights on", "Messiness"], correctAnswerIndex: 3 },
      { question: "What was the location of your first date?", options: ["A cafe", "A park", "A restaurant", "The movies"], correctAnswerIndex: 0 },
    ];
  }
};

export const generateTruthOrDare = async (type: 'truth' | 'dare'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a single, fun, and romantic "${type}" prompt for a couple.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating truth or dare:", error);
        return type === 'truth' ? "What's a secret you've never told anyone?" : "Do a silly dance for 30 seconds.";
    }
};

export const generateRomanticMessage = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a short, sweet, and romantic message that one partner can send to another. No more than 20 words.",
        });
        return response.text;
    } catch (error) {
        console.error("Error generating romantic message:", error);
        return "Thinking of you always! ❤️";
    }
};
