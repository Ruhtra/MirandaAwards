import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { Role } from '@/prisma/generated/enums'
import { admin } from 'better-auth/plugins'
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [nextCookies(), admin()],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: Role.USER,
        input: false,
      },
    },
  },
})

// type Session = typeof auth.$Infer.Session;
