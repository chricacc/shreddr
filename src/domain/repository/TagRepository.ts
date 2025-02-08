export interface TagRepository {
    findAll(): Promise<string[]>;
}