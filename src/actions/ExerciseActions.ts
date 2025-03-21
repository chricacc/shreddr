'use server'

import { revalidatePath } from "next/cache";

import { ActionError } from "./model/ActionError";
import fs from "node:fs/promises";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { dependencies } from "@/dependency-injection/dependencies";
import { Exercise } from "@/domain/model/Exercise";
import { PersistenceError } from "@/domain/errors/PersistenceError";
import { exerciseToDto } from "../application/model/ExerciseDto";

const createExerciseSchema = zfd.formData({
    name: zfd.text(z.string().min(3).max(50)),
    description: zfd.text(z.string()),
    difficulty: zfd.text(z.enum(["easy", "medium", "hard"])),
    tags: zfd.repeatable(z.array(z.string()).optional()),
    published: zfd.checkbox({ trueValue: "true" }),
    tablaturefile: zfd.file()
});

const updateExerciseSchema = zfd.formData({
    id: zfd.text(z.string()),
    name: zfd.text(z.string().min(3).max(50)),
    description: zfd.text(z.string()),
    difficulty: zfd.text(z.enum(["easy", "medium", "hard"])),
    tags: zfd.repeatable(z.array(z.string()).optional()),
    published: zfd.checkbox({ trueValue: "true" }),
    tablaturefile: zfd.file(z.instanceof(File).optional()),
});

export const createExercise = actionClient
    .schema(createExerciseSchema)
    .action(async ({ parsedInput }) => {

        const exercise: Exercise = new Exercise(null, parsedInput.name, parsedInput.description, parsedInput.difficulty, parsedInput.tags ? parsedInput.tags : []);

        if (parsedInput.published)
            exercise.publish();

        let response = null;
        try {
            response = await dependencies.exerciseRepository.create(exercise);
        } catch (e) {
            if (e instanceof PersistenceError) {
                throw new ActionError(e.message);
            } else {
                throw new ActionError("Unexpected error");
            }
        }

        revalidatePath("/exercises");
        if (response) {
            const file = parsedInput.tablaturefile as File;
            if (file)
                await saveFile(file, response.getSlug());
            return exerciseToDto(response);
        }
    });

export const updateExercise = actionClient
    .schema(updateExerciseSchema)
    .action(async ({ parsedInput }) => {

        const exercise: Exercise = new Exercise(parsedInput.id, parsedInput.name, parsedInput.description, parsedInput.difficulty, parsedInput.tags ? parsedInput.tags : []);

        if (parsedInput.published)
            exercise.publish();

        let response = null;
        try {
            response = await dependencies.exerciseRepository.update(exercise);
        } catch (e) {
            if (e instanceof PersistenceError) {
                throw new ActionError(e.message);
            } else {
                throw new ActionError("Unexpected error");
            }
        }
        revalidatePath("/exercises/" + response?.getSlug());
        if (response) {
            const file = parsedInput.tablaturefile as File;
            if (file)
                await saveFile(file, response.getSlug());
            return exerciseToDto(response);
        }
    });

async function saveFile(file: File, filename: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/uploads/exercises/${filename}`, buffer);
}

export async function deleteExercise(params: FormData) {
    let response = null;

    const deletedExercise = await dependencies.exerciseRepository.delete(params.get("id") as string);
    revalidatePath("/exercises")
    response = await deletedExercise;

    if (response) {
        fs.unlink(`./public/uploads/exercises/${response.getSlug()}`)
        return exerciseToDto(response);
    }
}