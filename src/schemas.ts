import { z } from 'zod'

interface ItemResponse {
  id: number
  checksum: number

  authorId: number
  author: string

  originalId: number | null
  originalAuthor: string | null

  createdAt: string
  updatedAt: string
}

const PostItem = {
  originalId: z.number().optional(),
  checksum: z.number(),
}

export const schemas = {
  PostBufferRequest: z.object({
    ...PostItem,
    value: z.string(),
  }),
  postTrackRequest: z.object({
    ...PostItem,
    soundId: z.number(),
    patternIds: z.array(z.number()),
  }),
  postProjectRequest: z.object({
    ...PostItem,
    title: z.string(),
    bpm: z.number(),
    trackIds: z.array(z.number()),
    mixer: z.any(),
  }),
  postReaction: z.object({
    reaction: z.enum(['💅', '🔥', '💥', '😎', '🤫', '🤯', '🤮']),
    // TODO
  })
}

export namespace schemas {
  export type PostBufferRequest = z.infer<typeof schemas.PostBufferRequest>
  export type PostTrackRequest = z.infer<typeof schemas.postTrackRequest>
  export type PostProjectRequest = z.infer<typeof schemas.postProjectRequest>

  export interface BufferResponse extends ItemResponse {
    value: string
  }

  export interface TrackResponse extends ItemResponse {
    soundId: number
    patternIds: number[]
  }

  export interface ProjectResponse extends ItemResponse {
    title: string
    bpm: number
    trackIds: number[]
    mixer: any
  }
}
