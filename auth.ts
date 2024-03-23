import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { loginFormSchemaType } from "./app/auth/login/page"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
	pages: {
		signIn: "/",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			authorize: async credentials => {
				const { email, password } = credentials as loginFormSchemaType
				if (!email || !password) return null
				const user = await prisma.user.findFirst({
					where: { email },
				})
				if (!user) return null

				if (!bcrypt.compare(password, user.password!)) return null
				return user
			},
		}),
		Github,
		google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt: async ({ token }) => token,
		session: async ({ token, session }) => {
			if (session.user && token?.sub) {
				session.user.id = token.sub
			}
			return session
		},
	},
})
