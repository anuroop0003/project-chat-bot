import { groq } from '@/components/layout'
import { blobToFile } from '@/lib/audio-utils'
import type { GroqError } from 'groq-sdk'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { useModelsStore } from './models.store'

export type Roles = 'user' | 'assistant'

export type ChatSession = {
  id: string
  model: string
  role: Roles
  text: string
  timestamp: number
}

type ChatStore = {
  sessions: ChatSession[]
  createNewChat: (query: string) => Promise<void>
  createNewAudio: (blob: Blob) => Promise<void>
  isLoadingChat: boolean
  isGenerating: boolean
  isTyping: boolean
  chatError: string | null
  currentMessage: string
  userQuery: string
  abortController: AbortController | null

  setIsTyping: (bool: boolean) => void
  setIsGenerating: (bool: boolean) => void
  setCurrentMessage: (message: string) => void
  setUserQuery: (query: string) => void
  cancelStream: () => void
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  sessions: [],
  isLoadingChat: false,
  isGenerating: false,
  isTyping: false,
  chatError: null,
  userQuery: '',
  currentMessage: '',
  abortController: null,
  setIsTyping: (bool) => set({ isTyping: bool }),
  setIsGenerating: (bool) => set({ isGenerating: bool }),
  setCurrentMessage: (msg) => set({ currentMessage: msg }),
  setUserQuery: (query) => set({ userQuery: query }),

  cancelStream: () => {
    const controller = get().abortController
    if (controller) {
      controller.abort()
      set({ isTyping: false, isGenerating: false, abortController: null })
    }
  },

  createNewChat: async (query) => {
    const { currentModelId } = useModelsStore.getState()
    const userMessage: ChatSession = {
      id: uuidv4(),
      model: currentModelId,
      role: 'user',
      text: query,
      timestamp: Date.now()
    }

    set((state) => ({
      isLoadingChat: true,
      isGenerating: true,
      isTyping: true,
      chatError: null,
      sessions: [...state.sessions, userMessage],
      currentMessage: '',
      userQuery: ''
    }))

    const controller = new AbortController()
    set({ abortController: controller })

    const messageHistory = get().sessions.map(({ role, text }) => ({
      role,
      content: text
    }))
    messageHistory.push({ role: 'user', content: query })

    try {
      const stream = await groq.chat.completions.create(
        {
          messages: messageHistory,
          model: currentModelId,
          temperature: 0.5,
          max_completion_tokens: 1024,
          top_p: 1,
          stop: ', 6',
          stream: true
        },
        {
          signal: controller.signal
        }
      )
      get().setIsTyping(false)
      let content = ''
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content
        if (delta) {
          await new Promise((res) => setTimeout(res, 50))
          content += delta
          get().setCurrentMessage(content)
        }
      }
      get().setIsGenerating(false)

      const botMessage: ChatSession = {
        id: uuidv4(),
        model: currentModelId,
        role: 'assistant',
        text: content,
        timestamp: Date.now()
      }
      set((state) => ({
        sessions: [...state.sessions, botMessage],
        isGenerating: false,
        isTyping: false,
        abortController: null
      }))
    } catch (error: unknown) {
      const err = error as GroqError
      if (err.name !== 'AbortError') {
        set({ chatError: 'Failed to fetch available models', isTyping: false, isGenerating: false })
      }
    } finally {
      set({ isLoadingChat: false })
    }
  },

  createNewAudio: async (blob) => {
    const transcription = await groq.audio.transcriptions.create({
      file: blobToFile(blob),
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });   
    get().createNewChat(transcription.text)
  }
}))
