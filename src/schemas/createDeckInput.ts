import {z} from 'zod';

export const CreateDeckInputSchema = z.object({
    name: z.string()
});

export type CreateDeckInput = z.infer<typeof CreateDeckInputSchema>;
