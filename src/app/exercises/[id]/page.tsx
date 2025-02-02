"use server"
import { updateExercise } from "@/actions/ExerciseActions";
import DeleteExerciseButton from "@/components/DeleteExerciseButton";
import ExerciseFormDialog from "@/components/ExerciseFormDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import prisma from "@/lib/prisma";
import { Tag } from "@prisma/client";

export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const exercise = await prisma.exercise.findUnique({
        where: {
            slug: id,
            archived: false,
            published: true
        },
        include: {
            tags: true
        }
    })

    const tags: string[] = (await prisma.tag.findMany()).map((tag: Tag) => { return tag.name });

    return (
        exercise ? (
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl">{exercise?.name}</h1>
                            <div className="flex gap-2">
                                <ExerciseFormDialog actionName="Edit" exercise={exercise} serverAction={updateExercise} tags={tags} />
                                <DeleteExerciseButton exerciseId={exercise?.id} />
                            </div>
                        </div>
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <p>{exercise?.description}</p>
                </CardContent>
                <CardFooter>
                    <div className="flex gap-2">
                        {exercise.tags.map((tag: Tag) => {
                            return <Badge key={tag.name}>{tag.name}</Badge>
                        })}
                    </div>
                </CardFooter>
            </Card >
        ) : (
            <div>
                Oops, this content does not exist!
            </div>
        )
    );
}