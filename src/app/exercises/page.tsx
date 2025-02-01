import { createExercise } from "@/actions/exercise-actions";
import ExerciseCard from "@/components/exercise-card";
import ExerciseFormDialog from "@/components/exercise-form-dialog";

import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ExercisesPage() {
    const exercises = await prisma.exercise.findMany({
        where: {
            archived: false,
            published: true
        },
        take: 30
    });
    const count = await prisma.exercise.count({
        where: {
            archived: false,
            published: true
        }
    });

    return (
        <>
            <h1 className="text-3xl pb-4">Exercises ({count})</h1>

            <ExerciseFormDialog actionName="Create" serverAction={createExercise} exercise={null} />
            <div className="flex sm:flex-row flex-col gap-4 flex-wrap">
                {exercises.map((exercise) => (
                    <Link key={exercise.id} href={`/exercises/${exercise.slug}`}>
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    </Link>
                ))}
            </div>
        </>
    );
}