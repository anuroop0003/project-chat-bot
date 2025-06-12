import { ChatMessage } from '@/components/ui/chat-message'
import { TypingIndicator } from '@/components/ui/typing-indicator'
import { useChatStore, type ChatSession } from '@/store/chat.store'

interface MessageListProps {
  messages: ChatSession[]
}

export function MessageList({ messages }: MessageListProps) {
  const { isGenerating, isTyping, currentMessage } = useChatStore()

  return (
    <div className='space-y-4 overflow-visible'>
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} text={message.text} />
      ))}
      {isGenerating && <ChatMessage role='assistant' text={currentMessage} />}
      {isTyping && <TypingIndicator />}
    </div>
  )
}
