"use server"
import { updateExercise } from "@/actions/ExerciseActions";
import DeleteExerciseButton from "@/components/DeleteExerciseButton";
import ExerciseFormDialog from "@/components/ExerciseFormDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dependencies } from "@/dependency-injection/dependencies";
import { Exercise } from "@/domain/model/Exercise"


export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const exercise: Exercise | undefined = await dependencies.exerciseRepository.findBySlug(id || "");
    const tags: string[] = await dependencies.tagRepository.findAll();

    return (
        exercise ? (
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl">{exercise.getName()}</h1>
                            <div className="flex gap-2">
                                <ExerciseFormDialog actionName="Edit" exercise={Object.assign({}, exercise)} serverAction={updateExercise} tags={tags} />
                                <DeleteExerciseButton exerciseId={exercise.getId()} />
                            </div>
                        </div>
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <p>{exercise.getDescription()}</p>
                </CardContent>
                <CardFooter>
                    <div className="flex gap-2">
                        {exercise.getTags().map((tag) => {
                            return <Badge key={tag}>{tag}</Badge>
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