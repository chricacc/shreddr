import { Tag } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExerciseWithTags } from "@/actions/model/ExerciseWithTags";

export default function ExerciseCard({ exercise }: { exercise: ExerciseWithTags }) {
    return (
        <Card className="sm:w-[300px] w-full cursor-pointer h-[150px] hover:bg-muted hover:drop-shadow-2xl transition-all duration-200 ">
            <CardHeader className="px-4 py-2 h-1/4">
                <span className="text-xl">{exercise.name}</span>
            </CardHeader>
            <CardContent className="px-4 py-0 h-1/2 flex flex-wrap overflow-hidden text-ellipsis">
                {exercise.description}
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 h-1/4">
                <div className="flex gap-2 justify-start">
                    {exercise.tags.map((tag: Tag) => {
                        return <Badge key={tag.name}>{tag.name}</Badge>
                    })}
                </div>
            </CardFooter>

        </Card>
    )
}