"use server"
import { updateExercise } from "@/actions/exercise-actions";
import DeleteExerciseForm from "@/components/delete-exercise-form";
import ExerciseFormDialog from "@/components/exercise-form-dialog";

import prisma from "@/lib/prisma";

export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const exercise = await prisma.exercise.findUnique({
        where: {
            slug: id,
            archived: false,
            published: true
        }
    })

    return (
        exercise ? (
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl">{exercise?.name}</h1>
                    <div className="flex gap-2">
                        <ExerciseFormDialog actionName="Edit" exercise={exercise} serverAction={updateExercise} />
                        <DeleteExerciseForm exerciseId={exercise?.id} />
                    </div>
                </div>

                <p>{exercise?.description}</p>
                <p>{exercise?.published ? "published" : "draft"}</p>
            </div>
        ) : (
            <div>
                Oops, this content does not exist!
            </div>
        )
    );
}