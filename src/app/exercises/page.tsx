import { createExercise } from "@/actions/exercise-actions";
import ExerciseCard from "@/components/exercise-card";
import ExerciseForm from "@/components/exercise-form";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4">Create Exercise</Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create Exercise</DialogTitle>
                        <DialogDescription>
                            Create a sick exercise. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <ExerciseForm saveAction={createExercise} />
                </DialogContent >
            </Dialog >
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