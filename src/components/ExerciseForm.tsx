"use client"

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import FormSubmitButton from "./FormSubmitButton";
import { DialogFooter } from "./ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";
import { SelectTagInput } from "./ui/select-tag-input";
import { createExercise, createExerciseActionResult, updateExercise } from "@/actions/ExerciseActions";

interface ExerciseFormProps {
    exercise,
    setDialogIsOpen: (isOpen: boolean) => void, tags: string[]
}

export default function ExerciseForm({ exercise, setDialogIsOpen, tags }: ExerciseFormProps) {

    const createMode = !exercise?.id;

    const [message, setMessage] = useState("");
    const [nameMessages, setNameMessages] = useState([]);
    const [descriptionMessages, setDescriptionMessages] = useState([]);
    const [selectedTags, setSelectedTags] = useState((exercise?.tags.length) ? exercise?.tags : []);

    async function saveExercise(formData: FormData, serverAction: (formData: FormData) => any) {
        selectedTags.forEach((tag: string) => {
            formData.append("tags", tag);
        });

        const response = await serverAction(formData);

        if (response.serverError) {
            setMessage(response.serverError);
            return;
        } else if (response.validationErrors) {
            setNameMessages(response.validationErrors?.fieldErrors.name);
            setDescriptionMessages(response.validationErrors?.fieldErrors.description);
        } else {
            toast(`Exercise ${response.data?.name} saved!`);
            setDialogIsOpen(false);
        }
    }

    function onSubmit(formData: FormData) {
        return createMode ? saveExercise(formData, createExercise) : saveExercise(formData, updateExercise);
    }

    return (
        <form action={onSubmit}>
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
                        required
                    />
                    {nameMessages?.map((text) => {
                        return (
                            <span key="{text}" className="text-sm">{text}</span>
                        )
                    })}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <div className="col-span-3">
                        <Textarea
                            name="description"
                            placeholder="Describe the exercise here..."
                            className="min-h-[120px]"
                            defaultValue={exercise?.description}
                            required
                        />
                        {descriptionMessages?.map((text) => {
                            return (
                                <span key="{text}" className="text-sm">{text}</span>
                            )
                        })}
                    </div>

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