import {z} from 'zod';

export const CardInputSchema = z.object({
    front: z.string(),
    back: z.string()
});

export type CardInput = z.infer<typeof CardInputSchema>;
