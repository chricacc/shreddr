import { Exercise } from "@/domain/model/Exercise";

export type ExerciseDto = {
    id: string | null;
    name: string;
    description: string;
    slug: string;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
};

export function exerciseToDto(response: Exercise): ExerciseDto {
    return {
        id: response.getId(),
        name: response.getName(),
        description: response.getName(),
        slug: response.getSlug(),
        tags: response.getTags(),
        published: response.isPublished(),
        createdAt: response.getCreatedAt(),
        updatedAt: response.getUpdatedAt(),
        archived: response.isArchived()
    };
}