import { z } from 'zod'

const PostItem = {
  originalId: z.string().optional(),
}

const ghError = z.object({
  error: z.string(),
  error_description: z.string(),
  error_uri: z.string()
})

export const schemas = {
  // oauth
  oauthStart: z.object({
    redirect_to: z.string().regex(/[a-z0-9/_-]/gi).optional()
  }),
  oauthCallback: z.union([
    z.object({
      code: z.string(),
      state: z.string().optional()
    }),
    ghError
  ]),
  accessTokenResponse: z.union([
    z.object({
      access_token: z.string(),
      scope: z.string(),
      token_type: z.string()
    }),
    ghError
  ]),
  userResponse: z.union([
    z.object({
      login: z.string()
    }),
    ghError
  ]),

  // crud
  PostBufferRequest: z.object({
    ...PostItem,
    value: z.string(),
  }),
  postTrackRequest: z.object({
    ...PostItem,
    soundId: z.string(),
    patternIds: z.array(z.string()),
  }),
  postProjectRequest: z.object({
    ...PostItem,
    bpm: z.number(),
    title: z.string(),
    trackIds: z.array(z.string()),
    mixer: z.array(z.object({
      vol: z.number(),
      pages: z.array(z.number()),
    })),
  }),
  postPublishRequest: z.object({
    ...PostItem,
    bpm: z.number(),
    title: z.string(),
    mixer: z.array(z.object({
      vol: z.number(),
      pages: z.array(z.number()),
    })),
    tracks: z.array(
      z.object({
        sound: z.string(),
        patterns: z.array(z.string())
      })
    ),
    buffers: z.array(z.string()),
  }),
  postReaction: z.object({
    reaction: z.enum(['💅', '🔥', '💥', '😎', '🤫', '🤯', '🤮']),
    // TODO
  })
}

interface ItemResponse {
  id: string

  authorId: number
  author: string

  originalId: string | null
  originalAuthor: string | null

  remixCount: number | null
  originalRemixCount: number | null

  createdAt: string
  updatedAt: string
}

export namespace schemas {
  export type PostBufferRequest = z.infer<typeof schemas.PostBufferRequest>
  export type PostTrackRequest = z.infer<typeof schemas.postTrackRequest>
  export type PostProjectRequest = z.infer<typeof schemas.postProjectRequest>
  export type PostPublishRequest = z.infer<typeof schemas.postPublishRequest>

  export interface BufferResponse extends ItemResponse {
    value: string
  }

  export interface TrackResponse extends ItemResponse {
    soundId: string
    patternIds: string[]
  }

  export interface ProjectResponse extends ItemResponse {
    title: string
    bpm: number
    trackIds: string[]
    mixer: any
  }

  export interface PublishResponse {
    project: { created: boolean, item: ProjectResponse }
    tracks: { created: boolean, item: TrackResponse }[]
    buffers: { created: boolean, item: BufferResponse }[]
  }

  export interface User {
    id: number
    username: string
    createdAt: string
  }
}
