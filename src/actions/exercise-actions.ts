'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

import { Prisma } from '@prisma/client';

export async function createExercise(params: FormData) {
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
        return createdExercise
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2002") {
                return { message: `This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!` };
            } else {
                return { message: "Something went wrong!" }
            }
        }

    }


}

export async function updateExercise(params: FormData) {
    const slug = (params.get("name") as string).replace(/\s+/g, "-").toLowerCase();
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
        return updatedExercise;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code == "P2002") {
                return { message: `This ${e.meta?.target == "slug" ? "name" : e.meta?.target} is already used!` };
            } else {
                return { message: "Something went wrong!" }
            }
        }
    }

    revalidatePath("/exercises/" + slug);
}

export async function deleteExercise(params: FormData) {
    try {
        const deletedExercise = await prisma.exercise.delete({
            where: { id: params.get("id") as string }
        });
        revalidatePath("/exercises")
        return deletedExercise;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { message: "Something went wrong!" }
        }
    }
}