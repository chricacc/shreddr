"use client"

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import FormSubmitButton from "./FormSubmitButton";
import { DialogFooter } from "./ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";
import { ActionError } from "@/actions/model/ActionError";
import { SelectTagInput } from "./ui/select-tag-input";
import { ExerciseWithTags } from "@/actions/model/ExerciseWithTags";

interface ExerciseFormProps {
    saveAction: (formData: FormData, tags: string[]) => Promise<ExerciseWithTags | ActionError>,
    exercise: ExerciseWithTags | null,
    setDialogIsOpen: (isOpen: boolean) => void, tags: string[]
}

export default function ExerciseForm({ saveAction, exercise, setDialogIsOpen, tags }: ExerciseFormProps) {

    const simpleTags = exercise?.tags?.map(t => t.name);

    const [message, setMessage] = useState("");
    const [selectedTags, setSelectedTags] = useState((simpleTags?.length) ? simpleTags : []);

    async function handleSubmit(formData: FormData) {
        selectedTags.forEach((tag: string) => {
            formData.append("tags", tag);
        });
        const response = await saveAction(formData);
        if (response?.message) {
            setMessage(response.message);
            return;
        } else {
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
                    <Label htmlFor="tags" className="text-right">
                        Tags
                    </Label>
                    <SelectTagInput
                        className="col-span-3"
                        name="tags"
                        value={selectedTags}
                        onChange={setSelectedTags}
                        options={tags}
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