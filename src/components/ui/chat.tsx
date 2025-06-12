import { Button } from '@/components/ui/button'
import { MessageInput } from '@/components/ui/message-input'
import { MessageList } from '@/components/ui/message-list'
import { PromptSuggestions } from '@/components/ui/prompt-suggestions'
import { useAutoScroll } from '@/hooks/use-auto-scroll'
import { cn } from '@/lib/utils'
import { useChatStore, type ChatSession } from '@/store/chat.store'
import { ArrowDown } from 'lucide-react'
import { forwardRef, useMemo, useState, type ReactElement } from 'react'

interface ChatProps {
  className?: string
  suggestions?: string[]
}

export function Chat({ className, suggestions }: ChatProps) {
  const { sessions, createNewChat, isGenerating, isTyping, cancelStream, userQuery, setUserQuery, createNewAudio } = useChatStore()
  const isEmpty = useMemo(() => sessions.length === 0, [sessions.length])

  const handlecreateNewChat = (query: string) => createNewChat(query)

  const handleStop = () => cancelStream()

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setUserQuery(e.target.value)

  const handleTranscribeAudio = (blob: Blob) => {
    console.log("blob", blob.type);
    createNewAudio(blob)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    createNewChat(userQuery)
  }

  console.log('userQuery', userQuery)

  return (
    <ChatContainer className={className}>
      {isEmpty && suggestions ? (
        <PromptSuggestions append={handlecreateNewChat} label='Try these prompts ✨' suggestions={suggestions} />
      ) : null}

      {!isEmpty ? (
        <ChatMessages messages={sessions}>
          <MessageList messages={sessions} />
        </ChatMessages>
      ) : null}

      <ChatForm className='mt-auto relative' isPending={isGenerating || isTyping} handleSubmit={handleSubmit}>
        <MessageInput
          className='fixed bottom-2 left-0'
          value={userQuery}
          onChange={handleOnChange}
          stop={handleStop}
          isGenerating={isGenerating}
          transcribeAudio={handleTranscribeAudio}
        />
      </ChatForm>
    </ChatContainer>
  )
}
Chat.displayName = 'Chat'

export function ChatMessages({
  messages,
  children
}: React.PropsWithChildren<{
  messages: ChatSession[]
}>) {
  const { containerRef, scrollToBottom, handleScroll, shouldAutoScroll, handleTouchStart } = useAutoScroll([messages])

  return (
    <div className='grid grid-cols-1 overflow-y-auto pb-4' ref={containerRef} onScroll={handleScroll} onTouchStart={handleTouchStart}>
      <div className='max-w-full [grid-column:1/1] [grid-row:1/1]'>{children}</div>
      {!shouldAutoScroll && (
        <div className='pointer-events-none flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]'>
          <div className='sticky bottom-0 left-0 flex w-full justify-end'>
            <Button
              onClick={scrollToBottom}
              className='pointer-events-auto h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1'
              size='icon'
              variant='ghost'
            >
              <ArrowDown className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const ChatContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('grid max-h-full w-full grid-rows-[1fr_auto]', className)} {...props} />
})
ChatContainer.displayName = 'ChatContainer'

interface ChatFormProps {
  className?: string
  isPending: boolean
  handleSubmit: (event: { preventDefault: () => void }) => void
  children: ReactElement
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(({ children, handleSubmit, className }, ref) => {
  const [files, setFiles] = useState<File[] | null>(null)

  const onSubmit = (event: React.FormEvent) => {
    if (!files) {
      handleSubmit(event)
      return
    }

    handleSubmit(event)
    setFiles(null)
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children}
    </form>
  )
})

ChatForm.displayName = 'ChatForm'
