import z from "zod";

// Define a schema for a single day's availability
const daySchema = z.object({
    isActive: z.boolean().default(false),
    fromTime: z
        .string()
        .refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
            message: "fromTime must be in HH:mm format",
        }),
    tillTime: z
        .string()
        .refine((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time), {
            message: "fromTime must be in HH:mm format",
        }),
});

// Define the schema for all 7 days
const availabilitySchema = z.object({
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
});
