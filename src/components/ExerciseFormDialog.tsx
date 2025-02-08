"use client"

import ExerciseForm from "@/components/ExerciseForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function ExerciseFormDialog(params: { actionName: string, serverAction: (params: FormData, tags: string[]) => (Promise<any>), exercise, tags: string[] }) {

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4">{params.actionName}</Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{params.actionName} Exercise</DialogTitle>
                    <DialogDescription>
                        {params.actionName} your exercise. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ExerciseForm saveAction={params.serverAction} exercise={params.exercise} setDialogIsOpen={setDialogIsOpen} tags={params.tags} />
            </DialogContent >
        </Dialog >
    );
}