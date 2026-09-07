import { useContext } from "react";
import BotController from "./SchonContext-response";

const TopBar = (props) => {
  const BotC = useContext(BotController);
  return (
    <div className="flex flex-row h-[10%] w-full text-left p-8  bg-sage-200  justify-between items-center max-md:w-full max-md:h-[10%] max-md:text-[10px]">
      <div>
        <h1 className="font-semibold text-xl text-white">SchönGPT</h1>
        <p className="italic font-light text-m text-white">
          Reflective design interviewer
        </p>
      </div>
      <div className="flex flex-row items-center">
        <FeedbackButton />
        <ClearChatButton />
      </div>
    </div>
  );
};

const ClearChatButton = (props) => {
  const BotC = useContext(BotController);
  return (
    <div
      className="flex flex-row self-center my-4 text-center text-white bg-raspberry hover:bg-slate-400 rounded-lg content-center px-2 items-center "
      onClick={BotC.handleClearChat}
    >
      <p className="font-semibold ">Clear Chat</p>
    </div>
  );
};

const FeedbackButton = (props) => {
  const BotC = useContext(BotController);
  const color =
    BotC.feedback === 1
      ? "bg-blue-munsell hover:bg-blue-munsell-900"
      : "bg-gunmetal hover:bg-gunmetal-100";
  return (
    <div
      className={
        "flex flex-row self-center my-4 mx-2 text-center rounded-lg content-center px-2 items-center " +
        color
      }
      onClick={BotC.handleFeedbackMode}
    >
      <p className="font-semibold text-white">
        {BotC.feedbackMode ? "Interview Mode" : "Feedback Mode"}
      </p>
    </div>
  );
};

export default TopBar;
