import { Exercise } from "../model/Exercise";

export interface ExerciseRepository {
    findAll(): Promise<Exercise[]>;
    findBySlug(slug: string): Promise<Exercise | undefined>;
    search(query: string): Promise<Exercise[]>;
    create(exercise: Exercise): Promise<Exercise | undefined>;
    update(exercise: Exercise): Promise<Exercise | undefined>;
    delete(id: string): Promise<Exercise | undefined>;
    count(): Promise<number>;
}