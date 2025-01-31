import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideUser } from "lucide-react";

export default function ProfilePage() {
    return (
        <>
            <div className="mb-4">
                <ModeToggle />
            </div>
            <Card className="md:w-[450px] w-full">
                <CardHeader>
                    <h1 className="flex text-2xl items-center gap-2"><LucideUser /><span>Personal Info</span></h1>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Username" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" placeholder="Email address    " />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                </CardFooter>
            </Card >
        </>
    )
}

