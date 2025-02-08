import { TagRepository } from "@/domain/repository/TagRepository";
import prisma from "@/lib/prisma";
import { Tag } from "@prisma/client";

export class TagPrismaRepository implements TagRepository {
    async findAll(): Promise<string[]> {
        const tags: Tag[] = await prisma.tag.findMany();
        return tags.map((tag: Tag) => { return tag.name });
    }
}