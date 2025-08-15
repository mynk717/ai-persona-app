import { useState } from "react";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export const useOpenAIApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateResponse = async (promptGuidance, userMessage) => {
    setIsLoading(true);
    setError(null);

    if (!API_KEY) {
      setError(
        "OpenAI API key not found. Please check your .env or Vercel environment variables."
      );
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or "gpt-4" if you have access
          messages: [
            { role: "system", content: promptGuidance },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API call failed: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error(err);
      setError(
        "Sorry, something went wrong with the OpenAI API. Please try again."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateResponse, isLoading, error };
};
