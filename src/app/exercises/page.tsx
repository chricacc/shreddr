import ExerciseCard from "@/components/ExerciseCard";
import ExerciseFormDialog from "@/components/ExerciseFormDialog";
import { dependencies } from "@/dependency-injection/dependencies";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function ExercisesPage() {
    const exercises = await dependencies.exerciseRepository.findAll();
    const count = await dependencies.exerciseRepository.count();
    const tags: string[] = await dependencies.tagRepository.findAll();

    return (
        <div className="max-w-[1260px]">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl pb-4 flex items-center gap-3"><Dumbbell className="text-secondary" />Exercises ({count})</h1>
                <ExerciseFormDialog actionName="Create" tags={tags} />
            </div>
            <div className="flex sm:flex-row flex-col gap-5 flex-wrap">
                {exercises.map((exercise) => (
                    <Link key={exercise.getSlug()} href={`/exercises/${exercise.getSlug()}`}>
                        <ExerciseCard key={exercise.getId()} exercise={exercise} />
                    </Link>
                ))}
            </div>
        </div>
    );
}