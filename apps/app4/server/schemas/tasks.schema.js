const { z } = require("zod");

const idParamSchema = z.object({
    id: z.coerce.number().int().nonnegative(), // "12" => 12
});

const createTaskSchema = z.object({
    body: z.object({
        data: z.object({
            title: z.string().min(1, "title is required"),
            done: z.boolean().optional().default(false),
        }),
    }),
});

const patchTaskSchema = z.object({
    params: idParamSchema,
    body: z.object({
        data: z
            .object({
                title: z.string().min(1).optional(),
                done: z.boolean().optional(),
            })
            .refine((obj) => Object.keys(obj).length > 0, {
                message: "At least one field must be provided",
            }),
    }),
});

const getByIdSchema = z.object({
    params: idParamSchema,
});

const deleteByIdSchema = z.object({
    params: idParamSchema,
});

module.exports = {
    createTaskSchema,
    patchTaskSchema,
    getByIdSchema,
    deleteByIdSchema,
};
