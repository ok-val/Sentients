import { createContext, useState, useEffect } from "react";
import OpenAI from "openai";

const BotController = createContext(null);

const ASSISTANTS = {
  Interview: import.meta.env.VITE_SCHON_INTERVIEW,
  Feedback: import.meta.env.VITE_SCHON_FEEDBACK,
};

export const BotCore = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMode, setChatMode] = useState(0); // 0 is history, 1 is interactive chat

  const [feedback, setFeedback] = useState(false); // 0 interview mode, 1 feedback mode
  const [message, setMessage] = useState("");

  const initContext = [
    {
      role: "assistant",
      content:
        "Hello. I can help you clarify your design intentions. Please describe what you are working on.",
    },
  ];

  const [context, setContext] = useState(initContext);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    // Load twice on mount -- be careful
    // localStorage only returns strings, needs manual conversion
    const savedContext =
      JSON.parse(localStorage.getItem("Schon_Context")) != null || null;
    // Convo always starts with Chatbot turn
    if (savedContext?.length > 1) {
      setContext(JSON.parse(savedContext));
    } else {
      localStorage.setItem("Schon_Context", JSON.stringify(context));
    }
  }, []);

  // Refactor to useRef for DOM manipulation
  // var elem = document.getElementById("chatscreen");
  // useEffect(() => {
  //   if (elem) {
  //     elem.scrollTop = elem?.scrollHeight;
  //   }
  // }, [history]);

  function UpdateFeedback() {
    setFeedback(!feedback);
  }

  async function useOpenAIResponses(inputContext) {
    try {
      const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        instructions: "You are a helpful assistant.",
        input: inputContext,
        store: true,
      });
      if (response.status >= 400) {
        console.log("server err");
        throw new Error("400 server error");
      }
      const outputContext = [
        ...inputContext,
        { role: "assistant", content: response.output_text },
      ];
      setContext(outputContext);
      // localStorage.setItem("Schon_Context", outputContext);
      // console.log(JSON.parse(localStorage.getItem("Schon_Context")));
    } catch (error) {
      console.log(error.message);
      setError(error);
    }
  }

  async function SendMessage() {
    if (message.trim() != "") {
      // Create new message on thread
      // Fetch Thread Messages

      const inputThread = context.concat({
        role: "user",
        content: message.trim(),
      });

      // try {
      //   const response = await openai.responses.create({
      //     model: "gpt-5.6-luna",
      //     instructions: "",
      //     input: inputThread,
      //     store: true,
      //   });
      //   if (response.status >= 400) {
      //     throw new Error("server err");
      //   }
      // } catch (error) {
      //   setError(error);
      // } finally {
      //   SchonResponse();
      //   setMessage("");
      // }

      useOpenAIResponses(inputThread);
    }
  }

  async function SchonResponse() {
    setLoading(true);

    openai.beta.threads.runs
      .createAndPoll(thread.id, {
        assistant_id:
          feedback === 1 ? ASSISTANTS.Feedback : ASSISTANTS.Interview,
      })
      .then(() => {
        FetchThreadMessages();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function ToggleChatMode() {
    if (chatMode === 0) setChatMode(1);
    else if (chatMode === 1) setChatMode(0);
  }

  function ClearChatHistory() {
    setThread(null);
    setHistory(null);
    localStorage.removeItem("Schon_ThreadID");
    CreateThread();
  }

  return (
    <BotController.Provider
      value={{
        //state
        feedback,
        context,
        message,
        chatMode,
        loading,

        //methods
        UpdateFeedback,
        setMessage,
        SendMessage,
        ToggleChatMode,
        ClearChatHistory,
      }}
    >
      {props.children}
    </BotController.Provider>
  );
  // return <></>;
};

export default BotController;

const SchonColorPalette = {
  user_chat_bubble: "#f6bd60",
  Schon_chat_bubble: "#f5cac3",
  shadow_color: "#000000",
  message: "#383b3d",
  slider_handle: "#84a59d",
  slider_bar: "#f7ede2",
  settings_bar_bg: "#f28482",
  chat_screen_bg: "#f7f7f5",
  input_bar_bg: "#f3f3f3",
  white: "#ffffff",
  dark_blue: "#04102e",
  blue: "#025acc",
  pink: "#a10256",
  dark_pink: "#54022d",
};
