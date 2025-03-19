import ExerciseCard from "@/components/ExerciseCard";
import ExerciseFormDialog from "@/components/ExerciseFormDialog";
import Search from "@/components/Search";
import { dependencies } from "@/dependency-injection/dependencies";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function ExercisesPage(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    //const currentPage = Number(searchParams?.page) || 1;

    const [exercises, count, tags] = await Promise.all([
        dependencies.exerciseRepository.findAll(query),
        dependencies.exerciseRepository.count(),
        dependencies.tagRepository.findAll()
    ]);

    return (
        <div className="max-w-[1260px]">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl pb-4 flex items-center gap-3"><Dumbbell className="text-secondary" />Exercises ({count})</h1>

                <ExerciseFormDialog actionName="Create" tags={tags} />
            </div>
            <Search className="mb-8" />
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