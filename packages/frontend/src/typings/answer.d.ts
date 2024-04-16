declare namespace Answer {
  export type answer =
    | {
        type: 'answer'
        ownerId: string
        ownerName: string
        content: string
        id: string
        conversationId?: string
        error: boolean
        model: string
        modelType: string
        modelUrl: string
      }
    | {
        type: 'question'
        ownerId: string
        ownerName: string
        content: string
        id: string
      }
    | {
        type: 'loading'
        content: string
        id: string
      }
}
