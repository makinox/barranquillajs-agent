import { useState } from "react"
import { cn } from "../../utils"

type ChatMessage= {
  owner: "bot" | "user",
  message: string
}

const DEFAULT_CHAT = [
  {owner: "bot", message: "Hola"},
  {owner: "user", message: "Hola, como estas?"},
  {owner: "bot", message: "Bien y tu?"},
]

export const Chat = () => {
  const [chatHistory, setChatHistory] = useState<Array<ChatMessage>>(DEFAULT_CHAT as Array<ChatMessage>)

  const handleSubmit = (event: any) => {
    if (event.key !== 'Enter' || event.target.value === "") return

    const memo = JSON.parse(JSON.stringify(chatHistory))
    memo.push({owner: "user", message: event.target.value})
    setChatHistory(memo)

    event.target.value = ""
  }


  return <div className="flex flex-col items-center w-full">
    <ChatList list={chatHistory} />
    <input className="bg-neutral-900 w-full max-w-[80%] rounded-md p-2" onKeyDown={handleSubmit} />
  </div>
}

const ChatList = ({list}:{list: Array<ChatMessage>}) => {
  const classes = {
    container: cn("bg-neutral-900 flex flex-col items-center w-full max-w-[80%] rounded-md my-6 p-4"),
  }

  return (
    <section className={classes.container}>
      {list.map((item, index) => <ChatItem key={index} item={item} />)}
    </section>
  )
}

const ChatItem = ({item}:{item: ChatMessage}) => {
  const isBot = item.owner === "bot"
  const classes = {
    itemContainer: cn("flex flex-col w-full", {
      "items-start": isBot,
      "items-end": !isBot
    }),
    item: cn("my-2", {
      "p-1": isBot,
      "p-2 bg-neutral-800 rounded-md": !isBot,
    })
  }

  return <div className={classes.itemContainer}>
    <span className={classes.item}>{isBot && `${item.owner}:`} {item.message}</span>
  </div>
}