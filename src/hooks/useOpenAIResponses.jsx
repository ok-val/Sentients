import { useCallback, useState, useEffect } from "react";
import OpenAI from "openai";

export default function useOpenAIResponses(
  initContext,
  savedContextKey,
  instructions = "You are a helpful assistant.",
  role = "assistant",
) {
  const [context, setContext] = useState(initContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Responses API does not offer server-side history management, so local history is managed as part of hook
  useEffect(() => {
    // Load twice on mount -- be careful
    // localStorage only returns strings, needs manual conversion
    const savedContext = getLocalContext(savedContextKey);
    // Convo always starts with Chatbot turn
    if (savedContext?.length > 1) {
      setContext(savedContext);
    } else {
      setLocalContext(savedContextKey, context);
      // console.log(JSON.parse(localStorage.getItem("Schon_Context")));
    }
  }, []);

  const sendMessage = async (message) => {
    console.log("sendMessage fired");
    setIsLoading(true);
    const input = context.concat({
      role: "user",
      content: message.trim(),
    });

    try {
      const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        instructions: instructions,
        input: input,
        store: true,
      });
      if (response.status >= 400) {
        throw new Error("400 server error");
      }
      setContext([
        ...input,
        { role: role, content: response.output_text },
      ]);
    } catch (error) {
      console.log(error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem(savedContextKey);
    setContext(initContext);
  };

  function getLocalContext(key) {
    let res = null;
    try {
      const rawSavedData = localStorage.getItem(key);
      if (rawSavedData !== null) {
        res = JSON.parse(rawSavedData);
      }
    } catch (error) {
      // console.log("error parsing saved context, return null instead");
      res = null;
    }
    return res;
  }

  function setLocalContext(key, context) {
    localStorage.setItem("Schon_Context", JSON.stringify(context));
  }

  return {
    context,
    error,
    isLoading,
    sendMessage,
    clearChat,
    setLocalContext,
  };
}
// Could you tell me a fun fact?
