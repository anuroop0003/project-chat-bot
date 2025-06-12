import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { cn } from '@/lib/utils'
import type { Roles } from '@/store/chat.store'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { CopyButton } from './copy-button'

const chatBubbleVariants = cva('group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]', {
  variants: {
    isUser: {
      true: 'bg-primary text-primary-foreground',
      false: 'bg-muted text-foreground'
    },
    animation: {
      none: '',
      slide: 'duration-300 animate-in fade-in-0',
      scale: 'duration-300 animate-in fade-in-0 zoom-in-75',
      fade: 'duration-500 animate-in fade-in-0'
    }
  },
  compoundVariants: [
    {
      isUser: true,
      animation: 'slide',
      class: 'slide-in-from-right'
    },
    {
      isUser: false,
      animation: 'slide',
      class: 'slide-in-from-left'
    },
    {
      isUser: true,
      animation: 'scale',
      class: 'origin-bottom-right'
    },
    {
      isUser: false,
      animation: 'scale',
      class: 'origin-bottom-left'
    }
  ]
})

type Animation = VariantProps<typeof chatBubbleVariants>['animation']

export interface ChatMessageProps {
  role: Roles
  text: string
  animation?: Animation
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, text, animation = 'scale' }) => {
  const isUser = role === 'user'

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div className={cn(chatBubbleVariants({ isUser, animation }))}>
        <MarkdownRenderer>{text}</MarkdownRenderer>
        <div className='absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100'>
          <CopyButton content={text} copyMessage='Copied code to clipboard' />
        </div>
      </div>
    </div>
  )
}

// const ReasoningBlock = ({ part }: { part: ReasoningPart }) => {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className='mb-2 flex flex-col items-start sm:max-w-[70%]'>
//       <Collapsible open={isOpen} onOpenChange={setIsOpen} className='group w-full overflow-hidden rounded-lg border bg-muted/50'>
//         <div className='flex items-center p-2'>
//           <CollapsibleTrigger asChild>
//             <button className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
//               <ChevronRight className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
//               <span>Thinking</span>
//             </button>
//           </CollapsibleTrigger>
//         </div>
//         <CollapsibleContent forceMount>
//           <motion.div
//             initial={false}
//             animate={isOpen ? 'open' : 'closed'}
//             variants={{
//               open: { height: 'auto', opacity: 1 },
//               closed: { height: 0, opacity: 0 }
//             }}
//             transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
//             className='border-t'
//           >
//             <div className='p-2'>
//               <div className='whitespace-pre-wrap text-xs'>{part}</div>
//             </div>
//           </motion.div>
//         </CollapsibleContent>
//       </Collapsible>
//     </div>
//   )
// }
