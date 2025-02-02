'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

import { Exercise, Prisma, Tag } from '@prisma/client';
import { ActionError } from "./model/ActionError";
import { ExerciseWithTags } from "./model/ExerciseWithTags";


import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

// This schema is used to validate input from client.
const exerciseSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string(),
    tags: z.array(z.object({ tag: z.string() })),
    published: z.boolean()
});

/*export const createExercise = actionClient
    .schema(exerciseSchema)
    .action(async (params: FormData): (Promise<ExerciseWithTags | ActionError>) => {

    });
*/
export async function createExercise(params: FormData): (Promise<ExerciseWithTags | ActionError>) {

    const tagModels: Tag[] = params.getAll("tags")
        .filter((tag: FormDataEntryValue) => tag.toString().length > 0)
        .map((tag: FormDataEntryValue) => {
            return { name: tag.toString() }
        });

    let response = null;
    try {
        const createdExercise = await prisma.exercise.create({
            data: {
                name: params.get("name") as string,
                description: params.get("description") as string,
                slug: (params.get("name") as string).replace(/\s+/g, "-").toLowerCase(),
                published: params.get("published") === "true",
                tags: {
                    connect: tagModels,

                }
            },
            include: {
                tags: true
            }
        });
        revalidatePath("/exercises");
        response = createdExercise;
    } catch (e) {
        const error: ActionError = { message: "" }
        if (e instanceof Prisma.PrismaClientKnownRequestError) {

            if (e.code == "P2002") {
                error.message = `This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`;
            };
        } else {
            error.message = "Something went wrong!";
        }
        response = error;
    }
    return response;
}

export async function updateExercise(params: FormData): (Promise<ExerciseWithTags | ActionError>) {

    const tagModels: Tag[] = params.getAll("tags")
        .filter((tag: FormDataEntryValue) => tag.toString().length > 0)
        .map((tag: FormDataEntryValue) => {
            return { name: tag.toString() }
        });

    const slug = (params.get("name") as string).replace(/\s+/g, "-").toLowerCase();
    let response = null;
    try {
        const updatedExercise = await prisma.exercise.update({
            where: { id: params.get("id") as string },
            data: {
                name: params.get("name") as string,
                description: params.get("description") as string,
                slug: slug,
                published: params.get("published") === "true",
                tags: {
                    set: tagModels
                }
            },
            include: {
                tags: true
            }
        });

        revalidatePath("/exercises/" + slug);
        response = updatedExercise;
    } catch (e) {
        const error: ActionError = { message: "" };
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2002") {
                error.message = `This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`;
            } else {
                error.message = "Something went wrong!";
            }
        }
        response = error;
    }

    revalidatePath("/exercises/" + slug);
    return response;
}

export async function deleteExercise(params: FormData): (Promise<Exercise | ActionError>) {
    let response = null;
    try {
        const deletedExercise = await prisma.exercise.delete({
            where: { id: params.get("id") as string }
        });
        revalidatePath("/exercises")
        response = deletedExercise;
    } catch (e) {
        const error: ActionError = { message: "" };
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            error.message = "Something went wrong!";
        }
        response = error;
    }

    return response;
}


