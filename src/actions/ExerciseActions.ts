'use server'

import { revalidatePath } from "next/cache";

import { ActionError } from "./model/ActionError";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { dependencies } from "@/dependency-injection/dependencies";
import { Exercise } from "@/domain/model/Exercise";
import { PersistenceError } from "@/domain/errors/PersistenceError";

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

        const exercise: Exercise = new Exercise(null, parsedInput.name, parsedInput.description, parsedInput.tags ? parsedInput.tags : []);

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
        return Object.assign({}, response);
    });

export const updateExercise = actionClient
    .schema(updateExerciseSchema)
    .action(async ({ parsedInput }) => {

        const exercise: Exercise = new Exercise(parsedInput.id, parsedInput.name, parsedInput.description, parsedInput.tags ? parsedInput.tags : []);

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
        revalidatePath("/exercises/" + response.getSlug());
        return Object.assign({}, response);
    });

export async function deleteExercise(params: FormData) {
    let response = null;
    try {
        const deletedExercise = await dependencies.exerciseRepository.delete(params.get("id") as string);
        revalidatePath("/exercises")
        response = await deletedExercise;
    } catch (e) {
        throw new ActionError("Something went wrong!");
    }

    return Object.assign({}, response);;
}


