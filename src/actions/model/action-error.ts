export class ActionError {
    message: string
    constructor() {
        this.message = "";
    }
}

import { Prisma } from '@prisma/client'

export type ExerciseWithTags = Prisma.ExerciseGetPayload<{
    include: { tags: true }
}>