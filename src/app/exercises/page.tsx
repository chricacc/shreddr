import { createExercise } from "@/actions/exercise-actions";
import ExerciseCard from "@/components/exercise-card";
import ExerciseFormDialog from "@/components/exercise-form-dialog";

import prisma from "@/lib/prisma";
import { Tag } from "@prisma/client";
import Link from "next/link";

export default async function ExercisesPage() {
    const exercises = await prisma.exercise.findMany({
        where: {
            archived: false,
            published: true
        },
        take: 30,
        include: {
            tags: true
        }
    });
    const count = await prisma.exercise.count({
        where: {
            archived: false,
            published: true
        }
    });
    const tags: string[] = (await prisma.tag.findMany()).map((tag: Tag) => { return tag.name });

    return (
        <div className="max-w-[1260px]">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl pb-4">Exercises ({count})</h1>
                <ExerciseFormDialog actionName="Create" serverAction={createExercise} exercise={null} tags={tags} />
            </div>
            <div className="flex sm:flex-row flex-col gap-5 flex-wrap">
                {exercises.map((exercise) => (
                    <Link key={exercise.slug} href={`/exercises/${exercise.slug}`}>
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    </Link>
                ))}
            </div>
        </div>
    );
}