"use client"

import { deleteExercise } from "@/actions/exercise-actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function DeleteExerciseForm(params: { exerciseId: string }) {

    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const response = await deleteExercise(formData);
        if (response?.name) {
            toast(`Exercise ${response?.name} deleted!`);
            router.push("/exercises");
        } else if (response?.message) {
            toast("Oops, something went wrong!");
        }
    }

    return (<form action={handleSubmit}>
        <Input name="id" defaultValue={params.exerciseId} type="hidden" />
        <Button type="submit">Delete</Button>
    </form>)
}