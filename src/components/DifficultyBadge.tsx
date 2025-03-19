import { Badge } from "./ui/badge";

type DifficultyBadgeProps = {
    level: string
}

export default function DifficultyBadge(props: DifficultyBadgeProps) {

    return (
        <Badge className="h-5 text-xs" variant={props.level}>{props.level}</Badge>
    )
}