// Root for Schon

import { useContext, useEffect, useRef } from "react";
import TopBar from "./TopBar";
import { BotCore } from "./SchonContext-response";
import { ScreenContainer } from "../common";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import BotController from "./SchonContext-response";

const Schon = (props) => {
  return (
    <BotCore>
      <ScreenContainer>
        <TopBar />
        <ChatScreen />
      </ScreenContainer>
    </BotCore>
  );
};

const ChatScreen = (props) => {
  const BotC = useContext(BotController);
  const bottomAnchorRef = useRef(null);

  function scrollToBottom() {
    bottomAnchorRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [BotC.context]);

  return (
    <div className="flex flex-col h-[90%] w-full bg-white py-3 px-3 justify-stretch max-md:w-full max-md:h-full">
      <ChatHistory forwardRef={bottomAnchorRef} />
      <InputBar handleScrollToBottom={scrollToBottom} />
    </div>
  );
};

const ChatHistory = (props) => {
  const BotC = useContext(BotController);
  return (
    <div
      id="chatscreen"
      className="h-full overflow-y-scroll flex flex-col"
    >
      {BotC.context?.map((item, index) => {
        return <ChatBubble key={index} item={item} />;
      })}
      <div ref={props.forwardRef} />
    </div>
  );
};

const ChatBubble = (props) => {
  const BotC = useContext(BotController);

  let tailwindString =
    "w-fit max-w-[40%] px-2.5 py-2.5 mb-2.5 mt-2.5 font-light ";

  if (props.item !== null) {
    if (props.item.role == "user") {
      tailwindString += "self-end ";
      tailwindString += "rounded-l-lg rounded-br-lg bg-gunmetal-800 ";
    } else if (props.item.role == "assistant") {
      tailwindString += "self-start ";
      tailwindString += "rounded-r-lg rounded-bl-lg bg-sage-500 ";
    }
  }

  return (
    <div className={tailwindString + "w-fit "}>
      {<p>{props.item?.content}</p>}
    </div>
  );
};

const InputBar = (props) => {
  const BotC = useContext(BotController);

  return (
    <div className="w-full flex flex-row items-center justify-items-center">
      <input
        className="h-10 w-full mr-2 px-2 rounded-lg"
        value={BotC.message}
        onChange={(e) => BotC.setMessage(e.target.value)}
        onSubmitCapture={BotC.handleSendMessage}
        disabled={BotC.loading}
        onFocus={props.handleScrollToBottom}
        style={{
          backgroundColor: BotC.loading ? "#22333b" : "#cad9e0",
        }}
      />

      <SendButton />
    </div>
  );
};

const SendButton = (props) => {
  const BotC = useContext(BotController);

  return (
    <PaperAirplaneIcon
      onClick={BotC.handleSendMessage}
      color="#475034"
      className="rounded-lg w-7 h-7 hover:bg-slate-200"
    />
  );
};

export default Schon;
