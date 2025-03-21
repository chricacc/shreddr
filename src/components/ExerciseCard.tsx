import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Exercise } from "@/domain/model/Exercise";
import DifficultyBadge from "./DifficultyBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
    return (
        <Card className="sm:w-[300px] w-full cursor-pointer h-[200px] hover:bg-muted hover:drop-shadow-2xl transition-all duration-200 ">
            <CardHeader className="px-4 py-2 h-1/4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-xl overflow-hidden text-ellipsis">{exercise.getName()}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{exercise.getName()}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="px-4 py-0 h-1/4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="flex flex-wrap overflow-hidden text-ellipsis">
                                {exercise.getDescription()}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{exercise.getDescription()}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </CardContent>
            <CardFooter className="overflow-hidden px-4 pb-3 pt-0 h-1/2">
                <div className="flex flex-wrap gap-1 justify-start">
                    <DifficultyBadge level={exercise.getDifficulty()} />
                    {exercise.getTags().map((tag: string) => {
                        return <Badge key={tag} className="h-5 text-xs">{tag}</Badge>
                    })}
                </div>
            </CardFooter>

        </Card>
    )
}