import {z} from "zod";

export const newEventSchema= z.object ({
    title: z.string(),
    url: z.string(),
    description: z.string(),
    duration: z.number(),
    videoCallSoftware: z.string(),
    id: z.string().optional(),
})