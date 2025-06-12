import { Chat as ChatContainer } from '@/components/ui/chat'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useModelsStore } from '@/store/models.store'
import { useEffect } from 'react'

const suggestions = [
  'What is the weather in San Francisco?',
  'Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?',
  'Design a simple algorithm to find the longest palindrome in a string.'
]

export default function Chat() {
  const { availableModels, currentModelId, fetchAvailableModels, setCurrentModelId } = useModelsStore()

  useEffect(() => {
    fetchAvailableModels()
  }, [])

  return (
    <div className='flex flex-col h-full w-full p-5'>
      <div className='flex justify-end mb-2'>
        <Select defaultValue='Select Model' value={currentModelId} onValueChange={setCurrentModelId}>
          <SelectTrigger className='min-w-[180px] max-w-full'>
            <SelectValue placeholder='Select Model' />
          </SelectTrigger>
          <SelectContent>
            {availableModels?.data?.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChatContainer className='grow' suggestions={suggestions} />
    </div>
  )
}
