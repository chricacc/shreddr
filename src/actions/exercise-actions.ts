'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

import { Exercise, Prisma } from '@prisma/client';
import { ActionError } from "./model/action-error";


export async function createExercise(params: FormData): (Promise<Exercise | ActionError>) {
    let response = null;
    try {
        const createdExercise = await prisma.exercise.create({
            data: {
                name: params.get("name") as string,
                description: params.get("description") as string,
                slug: (params.get("name") as string).replace(/\s+/g, "-").toLowerCase(),
                published: params.get("published") === "true"
            },
        });
        revalidatePath("/exercises");
        response = createdExercise;
    } catch (e) {
        const error = new ActionError();
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

export async function updateExercise(params: FormData): (Promise<Exercise | ActionError>) {
    const slug = (params.get("name") as string).replace(/\s+/g, "-").toLowerCase();
    let response = null;
    try {
        const updatedExercise = await prisma.exercise.update({
            where: { id: params.get("id") as string },
            data: {
                name: params.get("name") as string,
                description: params.get("description") as string,
                slug: slug,
                published: params.get("published") === "true"
            },
        });

        revalidatePath("/exercises/" + slug);
        response = updatedExercise;
    } catch (e) {
        const error = new ActionError();
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
        const error = new ActionError();
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            error.message = "Something went wrong!";
        }
        response = error;
    }

    return response;
}