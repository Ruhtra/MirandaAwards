import { z } from "zod"

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "O nome deve ter pelo menos 3 caracteres",
    })
    .max(100, {
      message: "O nome deve ter no máximo 100 caracteres",
    }),
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    })
    .max(100, {
      message: "A senha deve ter no máximo 100 caracteres",
    }),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
})

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "O nome deve ter pelo menos 3 caracteres",
    })
    .max(100, {
      message: "O nome deve ter no máximo 100 caracteres",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "Email inválido",
    })
    .optional(),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    })
    .max(100, {
      message: "A senha deve ter no máximo 100 caracteres",
    })
    .optional()
    .nullable(),
  role: z.enum(["USER", "ADMIN"]).optional(),
})

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
