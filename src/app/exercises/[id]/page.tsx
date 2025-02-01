"use server"
import { updateExercise } from "@/actions/exercise-actions";
import DeleteExerciseForm from "@/components/delete-exercise-form";
import ExerciseFormDialog from "@/components/exercise-form-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl">{exercise?.name}</h1>
                            <div className="flex gap-2">
                                <ExerciseFormDialog actionName="Edit" exercise={exercise} serverAction={updateExercise} />
                                <DeleteExerciseForm exerciseId={exercise?.id} />
                            </div>
                        </div>
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <p>{exercise?.description}</p>
                </CardContent>
                <CardFooter>
                    <p>{exercise?.published ? "published" : "draft"}</p>
                </CardFooter>
            </Card >
        ) : (
            <div>
                Oops, this content does not exist!
            </div>
        )
    );
}