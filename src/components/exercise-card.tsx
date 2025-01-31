import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";

export default function ExerciseCard({ exercise }) {
    return (
        <Card className="md:w-[300px] w-full cursor-pointer h-[150px]">
            <CardHeader>
                {exercise.name}
                <CardDescription>
                    {exercise.description}
                </CardDescription>
                <CardContent>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </CardHeader>

        </Card>
    )
}