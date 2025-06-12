import { groq } from '@/components/layout'
import type { ModelListResponse } from 'groq-sdk/resources/models.mjs'
import { create } from 'zustand'

type ModelsStore = {
  availableModels: ModelListResponse
  currentModelId: string
  setCurrentModelId: (modelId: string) => void
  isLoadingModels: boolean
  modelError: string | null
  fetchAvailableModels: () => Promise<void>
  resetModelState: () => void
}

export const useModelsStore = create<ModelsStore>()((set) => ({
  availableModels: {
    data: [],
    object: 'list'
  },
  currentModelId: 'deepseek-r1-distill-llama-70b',
  setCurrentModelId: (modelId: string) => set({ currentModelId: modelId }),
  isLoadingModels: false,
  modelError: null,
  fetchAvailableModels: async () => {
    set({ isLoadingModels: true, modelError: null })
    try {
      const response = await groq.models.list()
      set({ availableModels: response })
    } catch (_) {
      set({ modelError: 'Failed to fetch available models' })
    } finally {
      set({ isLoadingModels: false })
    }
  },
  resetModelState: () =>
    set({
      availableModels: { data: [], object: 'list' },
      currentModelId: '',
      modelError: null
    })
}))
