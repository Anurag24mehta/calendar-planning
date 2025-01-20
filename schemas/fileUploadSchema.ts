import * as z from "zod";
export const imageUploadSchema = z.object({
    image: z
        .custom<File>((file) => {
            if (!(file instanceof File)) {
                return false;
            }

            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                return false;
            }

            // Validate file size (e.g., max 5MB)
            const maxSizeInBytes = 5 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                return false;
            }

            return true;
        }, {
            message: "File must be an image of type JPEG, PNG, or GIF and less than 5MB in size.",
        }),
});