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
import { createExercise, updateExercise } from "@/actions/ExerciseActions";
import { ExerciseDto } from "@/application/model/ExerciseDto";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface ExerciseFormProps {
    exercise: ExerciseDto | undefined,
    setDialogIsOpen: (isOpen: boolean) => void, tags: string[]
}

export default function ExerciseForm({ exercise, setDialogIsOpen, tags }: ExerciseFormProps) {

    const createMode = !exercise?.id;

    const [message, setMessage] = useState("");
    const [nameMessages, setNameMessages] = useState<string[]>([]);
    const [descriptionMessages, setDescriptionMessages] = useState<string[]>([]);
    const [fileMessages, setFileMessages] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState((exercise?.tags.length) ? exercise?.tags : []);

    async function saveExercise(formData: FormData) {
        selectedTags.forEach((tag: string) => {
            formData.append("tags", tag);
        });

        let response = null;
        if (createMode) {
            response = await createExercise(formData);
        } else {
            response = await updateExercise(formData);
        }

        if (!response) {
            setMessage("Something went wrong.");
            return;
        }

        if (response.serverError) {
            setMessage(response.serverError);
            return;
        } else if (response.validationErrors) {
            if (response.validationErrors?.fieldErrors.name)
                setNameMessages(response.validationErrors.fieldErrors.name);
            if (response.validationErrors?.fieldErrors.description)
                setDescriptionMessages(response.validationErrors.fieldErrors.description);
            if (response.validationErrors?.fieldErrors.tablaturefile)
                setFileMessages(response.validationErrors.fieldErrors.tablaturefile);
        } else {
            console.log(response);

            toast(`Exercise ${response.data?.name} saved!`);
            setDialogIsOpen(false);
        }
    }

    return (
        <form action={saveExercise}>
            <Input name="id" type="hidden" defaultValue={exercise?.id ? exercise.id : ""} />
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
                    <Label htmlFor="difficulty" className="text-right">
                        Difficulty
                    </Label>
                    <div className="col-span-3">
                        <RadioGroup defaultValue={exercise?.difficulty} name="difficulty">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="easy" id="r1" />
                                <Label htmlFor="r1">Easy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="r2" />
                                <Label htmlFor="r2">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hard" id="r3" />
                                <Label htmlFor="r3">Hard</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tablaturefile" className="text-right">
                        Tablature
                    </Label>
                    <Input
                        className="col-span-3"
                        type="file"
                        name="tablaturefile"
                    />
                    {fileMessages?.map((text) => {
                        return (
                            <span key="{text}" className="text-sm">{text}</span>
                        )
                    })}
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
                    <Checkbox name="published" className="col-span-3" defaultChecked={true} value="true" checked={exercise?.published} />
                </div>
            </div>

            <DialogFooter>
                <FormSubmitButton message={message} />
            </DialogFooter>
        </form>
    )
}