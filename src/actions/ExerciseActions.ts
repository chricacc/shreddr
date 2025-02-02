'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

import { Exercise, Prisma } from '@prisma/client';
import { ActionError } from "./model/ActionError";


import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";

const createExerciseSchema = zfd.formData({
    name: zfd.text(z.string().min(3).max(50)),
    description: zfd.text(z.string()),
    tags: zfd.repeatable(z.array(z.string()).optional()),
    published: zfd.checkbox({ trueValue: "true" })
});

const updateExerciseSchema = zfd.formData({
    id: zfd.text(z.string()),
    name: zfd.text(z.string().min(3).max(50)),
    description: zfd.text(z.string()),
    tags: zfd.repeatable(z.array(z.string()).optional()),
    published: zfd.checkbox({ trueValue: "true" })
});

export const createExercise = actionClient
    .schema(createExerciseSchema)
    .action(async ({ parsedInput }) => {

        const tags = parsedInput.tags ? parsedInput.tags : [];

        const tagModels = tags
            .filter((tag: FormDataEntryValue) => tag.toString().length > 0)
            .map((tag: FormDataEntryValue) => {
                return { name: tag.toString() }
            });

        let response = null;
        try {
            const createdExercise = await prisma.exercise.create({
                data: {
                    name: parsedInput.name,
                    description: parsedInput.description,
                    slug: parsedInput.name.replace(/\s+/g, "-").toLowerCase(),
                    published: parsedInput.published,
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
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new ActionError(`This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`);
                };
            } else {
                throw new ActionError("Something went wrong!");
            }
        }
        return response;
    });

export const updateExercise = actionClient
    .schema(updateExerciseSchema)
    .action(async ({ parsedInput }) => {

        const tags = parsedInput.tags ? parsedInput.tags : [];

        const tagModels = tags
            .filter((tag: FormDataEntryValue) => tag.toString().length > 0)
            .map((tag: FormDataEntryValue) => {
                return { name: tag.toString() }
            });

        const slug = parsedInput.name.replace(/\s+/g, "-").toLowerCase();
        let response = null;
        try {
            const updatedExercise = await prisma.exercise.update({
                where: {
                    id: parsedInput.id,
                },
                data: {
                    name: parsedInput.name,
                    description: parsedInput.description,
                    slug: slug,
                    published: parsedInput.published,
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
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code == "P2002") {
                throw new ActionError(`This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!`);
            } else {
                throw new ActionError("Something went wrong!");
            }
        }

        revalidatePath("/exercises/" + slug);
        return response;
    });

export async function deleteExercise(params: FormData): (Promise<Exercise | ActionError>) {
    let response = null;
    try {
        const deletedExercise = await prisma.exercise.delete({
            where: { id: params.get("id") as string }
        });
        revalidatePath("/exercises")
        response = deletedExercise;
    } catch (e) {
        const error = { message: "" };
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            error.message = "Something went wrong!";
        }
        response = error;
    }

    return response;
}


