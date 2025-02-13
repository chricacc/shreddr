import { Exercise } from "@/domain/model/Exercise";
import { ExerciseRepository } from "@/domain/repository/ExerciseRepository";
import prisma from "@/lib/prisma";
import { ExerciseWithTags } from "./model/ExerciseWithTags";
import { Prisma } from "@prisma/client";
import { PersistenceError } from "@/domain/errors/PersistenceError";

export class ExercisePrismaRepository implements ExerciseRepository {
    async count(): Promise<number> {
        return await prisma.exercise.count({
            where: {
                archived: false,
                published: true
            }
        });
    }

    public async findAll(): Promise<Exercise[]> {
        const prismaExercises: ExerciseWithTags[] = await prisma.exercise.findMany({
            where: {
                archived: false,
                published: true
            },
            take: 30,
            include: {
                tags: true
            }
        });

        return this.mapToDomainModels(prismaExercises);
    }

    public async search(query: string): Promise<Exercise[]> {
        const prismaExercises: ExerciseWithTags[] = await prisma.exercise.findMany({
            where: {
                archived: false,
                published: true,
                OR: [
                    {
                        name: {
                            contains: query
                        }
                    },
                    {
                        description: {
                            contains: query
                        }
                    }
                ]
            },
            take: 30,
            include: {
                tags: true
            }
        });

        return this.mapToDomainModels(prismaExercises);
    }

    public async findBySlug(slug: string): Promise<Exercise | null> {
        const exercise = await prisma.exercise.findUnique({
            where: {
                slug: slug,
                archived: false,
                published: true
            },
            include: {
                tags: true
            }
        })
        if (exercise)
            return this.mapToDomainModel(exercise);
        else
            return null;
    }

    public async create(exercise: Exercise): Promise<Exercise | undefined> {
        const prismaTags = this.mapToPrismaTags(exercise.getTags());
        try {
            const createdExercise = await prisma.exercise.create({
                data: {
                    name: exercise.getName(),
                    description: exercise.getDescription(),
                    slug: exercise.getSlug(),
                    published: exercise.isPublished(),
                    tags: {
                        connect: prismaTags,
                    }
                },
                include: {
                    tags: true
                }
            });
            return this.mapToDomainModel(createdExercise)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new PersistenceError(`This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`);
                };
            } else {
                throw new PersistenceError("Something went wrong!");
            }
        }
    }

    public async update(exercise: Exercise): Promise<Exercise | undefined> {
        const prismaTags = this.mapToPrismaTags(exercise.getTags());
        let exerciseId = exercise.getId();
        if (!exerciseId) {
            exerciseId = "";
        }

        if (exercise.getId() == null)
            throw new PersistenceError("Cannot update Exercise with id=null");

        try {
            const updatedExercise = await prisma.exercise.update({
                where: {
                    id: exerciseId,
                },
                data: {
                    name: exercise.getName(),
                    description: exercise.getDescription(),
                    slug: exercise.getSlug(),
                    published: exercise.isPublished(),
                    tags: {
                        set: prismaTags
                    }
                },
                include: {
                    tags: true
                }
            });

            return this.mapToDomainModel(updatedExercise);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new PersistenceError(`This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`);
                };
            } else {
                throw new PersistenceError("Something went wrong!");
            }
        }
    }

    public async delete(id: string): Promise<Exercise> {
        const deletedExercise = await prisma.exercise.delete({
            where: { id: id },
            include: {
                tags: true
            }
        });

        return this.mapToDomainModel(deletedExercise);
    }

    private mapToDomainModels(prismaExercises: ExerciseWithTags[]): Exercise[] | PromiseLike<Exercise[]> {
        return prismaExercises.map(exercise => this.mapToDomainModel(exercise));
    }

    private mapToDomainModel(prismaExercise: ExerciseWithTags): Exercise {

        let tags: string[] = [];
        if (prismaExercise.tags) {
            tags = prismaExercise.tags?.map(tag => tag.name);
        }
        return new Exercise(prismaExercise.id, prismaExercise.name, prismaExercise.description, tags, prismaExercise.createdAt, prismaExercise.updatedAt, prismaExercise.published || false, prismaExercise.archived || false);
    };

    private mapToPrismaTags(tags: string[]) {
        const tagModels = tags
            .filter((tag: FormDataEntryValue) => tag.toString().length > 0)
            .map((tag: FormDataEntryValue) => {
                return { name: tag.toString() };
            });
        return tagModels;
    }


}