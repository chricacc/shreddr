import { ExerciseRepository } from "@/domain/repository/ExerciseRepository"
import { TagRepository } from "@/domain/repository/TagRepository";
import { ExercisePrismaRepository } from "@/persistence/prisma/ExercisePrismaRepository";
import { TagPrismaRepository } from "@/persistence/prisma/TagPrismaRepository";

export type Dependencies = {
    exerciseRepository: ExerciseRepository;
    tagRepository: TagRepository;
}

export const dependencies: Dependencies = {
    exerciseRepository: new ExercisePrismaRepository(),
    tagRepository: new TagPrismaRepository()
}