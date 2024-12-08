import { useMemo, useState } from "react"

import { postAsk } from "../../controller/ask"
import { cn } from "../../utils"

type ChatMessage = {
  owner: "bot" | "user",
  message: string
}

const DEFAULT_CHAT = [
  { owner: "bot", message: "Hola, soy el asistente personal de BarranquillaJS, estoy acá para responderte preguntas sobre javascript y la comunidad exclusivamente" },
]

const generalClasses = {
  logo: cn("w-8 h-8 rounded-full bg-yellow-300 mt-4 mr-2")
}

export const Chat = () => {
  const [chatHistory, setChatHistory] = useState<Array<ChatMessage>>(DEFAULT_CHAT as Array<ChatMessage>)

  const processNewAsk = async (message: string) => {
    setChatHistory(prev => [...prev, { owner: "bot", message: "" }]);
    postAsk(message).then((response) => {
      if (response) setChatHistory(prev => replaceWithNewMessage(response, prev));
      else setChatHistory(prev => replaceWithNewMessage("Error", prev));
    }).catch(() => setChatHistory(prev => replaceWithNewMessage("Error", prev)))
  }

  const handleSubmit = async (event: any) => {
    const message = event.target.value
    if (event.key !== 'Enter' || message === "") return

    setChatHistory(prev => [...prev, { owner: "user", message: message }]);

    await processNewAsk(message);
    event.target.value = ""
  }



  return <div className="flex flex-col items-center w-full h-full px-6">
    <ChatList list={chatHistory} />
    <input className="bg-base-200 w-full max-w-[712px] rounded-md p-2" onKeyDown={handleSubmit} />
  </div>
}

const ChatList = ({ list }: { list: Array<ChatMessage> }) => {
  const classes = {
    container: cn("flex justify-center w-full my-6 overflow-y-scroll"),
    list: cn("max-w-[712px] w-full h-full rounded-md flex flex-col-reverse")
  }

  const soretdlist = useMemo(() => [...list].reverse(), [list])

  return (
    <section className={classes.container} style={{ height: `calc(100% - 150px)` }}>
      <div className={classes.list}>
        {soretdlist.map((item, index) => item.message !== "" ? <ChatItem key={index} item={item} /> : <ChatLoading />)}
      </div>
    </section>
  )
}

const ChatLoading = () => (
  <div className="flex items-start">
    <img className={generalClasses.logo} src="/logo.svg" />
    <div className="animate-pulse flex flex-col gap-2 mt-4">
      <span className="bg-gray-500 rounded-md block h-2 w-96" />
      <span className="bg-gray-500 rounded-md block h-2 w-72" />
    </div>
  </div>
)

const ChatItem = ({ item }: { item: ChatMessage }) => {
  const isBot = item.owner === "bot"
  const classes = {
    itemContainer: cn("flex flex-col w-full", {
      "items-start": isBot,
      "items-end": !isBot
    }),
    item: cn("my-2", {
      "p-1": isBot,
      "p-2 bg-base-300 rounded-md": !isBot,
    }),
  }

  return <div className={classes.itemContainer}>
    <div className="flex items-start">
      {isBot && <img className={generalClasses.logo} src="/logo.svg" />}
      <span className={classes.item}>{item.message}</span>
    </div>
  </div>
}

const replaceWithNewMessage = (newMessage: string, messageList: Array<ChatMessage>) => {
  const previousMessages = [...messageList]
  previousMessages.pop()
  previousMessages.push({ owner: "bot", message: newMessage })
  return previousMessages
}