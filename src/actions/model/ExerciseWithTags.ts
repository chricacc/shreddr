import { Prisma } from '@prisma/client'

export type ExerciseWithTags = Prisma.ExerciseGetPayload<{
    include: { tags: true }
}>