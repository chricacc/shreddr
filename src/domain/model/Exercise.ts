import { Difficulty } from "./Difficulty";


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
    private difficulty: Difficulty;

    public constructor(id: string | null, name: string, description: string, difficulty: Difficulty, tags: string[], createdAt?: Date, updatedAt?: Date, published?: boolean, archived?: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = [...tags];
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.published = published ? published : false;
        this.archived = archived ? archived : false;
        this.slug = this.generateSlug();
        this.difficulty = difficulty;
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

    public getDifficulty() {
        return this.difficulty;
    }

    private generateSlug() {
        let str = this.name.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        const to = "aaaaeeeeiiiioooouuuunc------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
}