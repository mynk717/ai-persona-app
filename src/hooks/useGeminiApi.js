import { useState } from "react";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export const useGeminiApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateResponse = async (promptGuidance, userMessage) => {
    setIsLoading(true);
    setError(null);

    if (!API_KEY) {
      setError(
        "API key not found. Please check your Vercel environment variables."
      );
      setIsLoading(false);
      return null;
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    // The API expects a simple, clean payload.
    // The model's persona is already configured by the system prompt, so we just send the user's message.
    const fullPrompt = {
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPrompt),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error(err);
      setError("Sorry, something went wrong. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateResponse, isLoading, error };
};
