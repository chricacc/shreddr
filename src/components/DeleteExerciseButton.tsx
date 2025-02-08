"use client"

import { deleteExercise } from "@/actions/ExerciseActions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function DeleteExerciseButton(params: { exerciseId: string | null }) {

    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const response = await deleteExercise(formData);
        if (response?.message) {
            toast("Oops, something went wrong!");
        } else {
            toast(`Exercise ${response?.name} deleted!`);
            router.push("/exercises");
        }
    }

    return (<form action={handleSubmit}>
        <Input name="id" defaultValue={params.exerciseId} type="hidden" />
        <Button type="submit" variant="destructive">Delete</Button>
    </form>)
}