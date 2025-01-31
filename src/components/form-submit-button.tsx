"use client"
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function FormSubmitButton({ message }: { message: string }) {

    const { pending } = useFormStatus();
    return (
        <>
            <p aria-live="polite">{message ? message : ""}</p>
            <Button type="submit" disabled={pending}>{pending ? "Submitting..." : "Save"}</Button>
        </>
    );
}