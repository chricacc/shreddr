export class Exercise {
    private id: string | null;
    private name: string;
    private description: string;
    private slug: string;
    private tags: string[] = [];
    private published: boolean = false;
    private createdAt: Date;
    private updatedAt: Date;
    private archived: boolean = false;

    public constructor(id: string | null, name: string, description: string, tags: string[], createdAt?: Date, updatedAt?: Date, published?: boolean, archived?: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = [...tags];
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.published = published ? published : false;
        this.archived = archived ? archived : false;
        this.slug = this.generateSlug();
    }

    public publish() {
        this.published = true;
    }

    public delete() {
        this.archived = true;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getSlug() {
        return this.slug;
    }

    public getDescription() {
        return this.description;
    }

    public getTags() {
        return [...(this.tags)];
    }

    public getCreatedAt() {
        return this.createdAt;
    }

    public getUpdatedAt() {
        return this.updatedAt;
    }

    public isPublished() {
        return this.published;
    }

    public isArchived() {
        return this.archived;
    }

    private generateSlug() {
        return this.name.replace(/\s+/g, "-").toLowerCase();
    }
}