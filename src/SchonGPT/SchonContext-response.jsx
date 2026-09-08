import { createContext, useState, useEffect } from "react";
import useOpenAIResponses from "../hooks/useOpenAIResponses";
import { schonInstructions } from "../prompts/schon-instructions";

const BotController = createContext(null);

export const BotCore = (props) => {
  const savedContextKey = "Schon_Context";
  const modelName = "gpt-5.6-luna";

  const [feedbackMode, setFeedbackMode] = useState(false); // false interview mode, true feedback mode
  const [message, setMessage] = useState("");

  const initContext = [
    {
      role: "assistant",
      content:
        "Hello. I can help you clarify your design intentions. Please describe what you are working on.",
    },
  ];

  const { context, error, loading, sendMessage, clearContext } =
    useOpenAIResponses(initContext, savedContextKey);

  // Refactored with useRef, handled in ChatScreen
  // var elem = document.getElementById("chatscreen");
  // useEffect(() => {
  //   elem?.scrollTo({ top: elem.scrollHeight, behavior: "smooth" });
  //   // elem.scrollTop = elem?.scrollHeight;
  // }, [context]);

  function handleFeedbackToggle() {
    setFeedbackMode(!feedbackMode);
  }

  function handleClearChat() {
    clearContext();
  }

  function handleSendMessage() {
    if (message.trim() != "") {
      sendMessage(
        message,
        feedbackMode
          ? schonInstructions.feedback
          : schonInstructions.interview,
        modelName,
      );
      // console.log(JSON.parse(localStorage.getItem("Schon_Context")));
      setMessage("");
    }
  }

  if (error) return <p>Oops, something went wrong: {error.message}</p>;

  return (
    <BotController.Provider
      value={{
        // state
        feedbackMode,
        context,
        message,
        loading,

        //methods
        handleFeedbackToggle,
        setMessage,
        handleSendMessage,
        handleClearChat,
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
