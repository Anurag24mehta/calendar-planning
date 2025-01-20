import {z} from "zod";

export const fullNameValidation = z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be less than 50 characters long")
    .regex(/^[a-zA-Z0-9\s]*$/, "Full name must only contain letters, numbers, and spaces")


export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be less than 50 characters long")
    .regex(/^\S*$/, "Username must not contain spaces")

export const onboardingSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
})