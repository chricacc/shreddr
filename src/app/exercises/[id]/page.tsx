import { deleteExercise, updateExercise } from "@/actions/exercise-actions";
import ExerciseForm from "@/components/exercise-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mb-4">Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:min-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Exercise</DialogTitle>
                                    <DialogDescription>
                                        Edit your exercise. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <ExerciseForm saveAction={updateExercise} exercise={exercise} />
                            </DialogContent >
                        </Dialog >
                        <form action={deleteExercise}>
                            <Input name="id" defaultValue={exercise?.id} type="hidden" />
                            <Button type="submit">Delete</Button>
                        </form>
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