import { Timestamp } from 'firebase/firestore'
import * as z from 'zod'

export const BaseTodoSchema = z.object({
  name: z.string(),
  description: z.string(),
})
export type BaseTodoType = z.infer<typeof BaseTodoSchema>

export const TodoSchema = BaseTodoSchema.merge(
  z.object({
    createdAt: z.instanceof(Timestamp),
    updatedAt: z.instanceof(Timestamp),
  }),
)
export type TodoType = z.infer<typeof TodoSchema>
