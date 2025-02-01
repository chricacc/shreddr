"use client"

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import FormSubmitButton from "./form-submit-button";
import { DialogFooter } from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";


export default function ExerciseForm({ saveAction, exercise, setDialogIsOpen }: { saveAction: (formData: FormData) => void, exercise: any, setDialogIsOpen: any }) {
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        const response = await saveAction(formData);
        if (response?.message) {
            setMessage(response?.message);
            return;
        } else if (response?.id) {
            toast(`Exercise ${response?.name} saved!`);
            setDialogIsOpen(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <Input name="id" type="hidden" defaultValue={exercise?.id} />
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right" hidden={exercise?.id ? true : false}>
                        Name
                    </Label>
                    <Input
                        name="name"
                        placeholder="Name your exercise..."
                        className="col-span-3"
                        defaultValue={exercise?.name}
                        type={exercise?.id ? "hidden" : ""}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Textarea
                        name="description"
                        placeholder="Describe the exercise here..."
                        className="col-span-3 min-h-[120px]"
                        defaultValue={exercise?.description}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="published" className="text-right">
                        Publish now
                    </Label>
                    <Checkbox name="published" className="col-span-3" value="true" checked={exercise?.published} />
                </div>
            </div>
            <DialogFooter>
                <FormSubmitButton message={message} />
            </DialogFooter>
        </form>

    )
}