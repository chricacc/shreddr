import { Exercise } from "../model/Exercise";

export interface ExerciseRepository {
    findAll(query: string): Promise<Exercise[]>;
    findBySlug(slug: string): Promise<Exercise | null>;
    search(query: string): Promise<Exercise[]>;
    create(exercise: Exercise): Promise<Exercise | undefined>;
    update(exercise: Exercise): Promise<Exercise | undefined>;
    delete(id: string): Promise<Exercise | undefined>;
    count(): Promise<number>;
}