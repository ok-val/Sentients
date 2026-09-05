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

  const [feedback, setFeedback] = useState(0); // 0 interview mode, 1 feedback mode
  const [message, setMessage] = useState("");
  const [context, setContext] = useState(initContext);

  const initContext = [
    {
      role: "assistant",
      content:
        "Hello. I can help you clarify your design intentions. Please describe what you are working on.",
    },
  ];

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    // Load a response on mount -- called twice in dev using StrictMode
    const savedContext = localStorage.getItem("Schon_Context");
    if (savedContext.length > 1) {
      setContext(savedContext);
    } else {
      localStorage.setItem(context);
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
    setFeedback(feedback == 0 ? 1 : 0);
  }

  async function useOpenAiResponses(context, message) {
    const savedContext = localStorage.getItem("Schon_Context");

    if (savedContext.length === 0) {
      try {
        const response = await openai.responses.create({
          model: "gpt-5.6-luna",
          instructions: "",
          input: context,
          store: true,
        });
        if (response.status >= 400) {
          throw new Error("400 server error");
        }
        const outputContext = context.concat(response.output);
        setContext(outputContext);
        localStorage.setItem("Schon_Context", outputContext);
      } catch (error) {
        setError(error);
      }
    } else {
      setContext(savedContext);
    }
  }

  // async function CreateThread() {
  //   const thread_id = localStorage.getItem("Schon_ThreadID");
  //   const starting_messages = [
  //     {
  //       content:
  //         "Hello. I can help you clarify your design intentions. Please describe what you are working on.",
  //       role: "assistant",
  //     },
  //   ];

  //   if (!thread_id) {
  //     openai.beta.threads
  //       .create({
  //         messages: starting_messages,
  //       })
  //       .then((resp) => {
  //         setThread(resp);
  //         localStorage.setItem("Schon_ThreadID", resp.id);
  //       });
  //   } else {
  //     openai.beta.threads.retrieve(thread_id).then((resp) => {
  //       setThread(resp);
  //     });
  //   }
  // }

  // async function FetchThreadMessages() {
  //   if (thread != null) {
  //     openai.beta.threads.messages
  //       .list(thread?.id, { limit: 100 })
  //       .then((resp) => {
  //         setHistory(resp.body.data?.reverse());
  //       });
  //   }
  // }

  async function SendMessage() {
    if (message.trim() != "") {
      // Create new message on thread
      // Fetch Thread Messages

      const inputThread = thread.concat({
        role: "user",
        input: message.trim(),
      });

      try {
        const response = await openai.responses.create({
          model: "gpt-5.6-luna",
          instructions: "",
          input: inputThread,
          store: true,
        });
        if (response.status >= 400) {
          throw new Error("server err");
        }
      } catch (error) {
        setError(error);
      } finally {
        SchonResponse();
        setMessage("");
      }
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
        history,
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
