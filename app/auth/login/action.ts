// src/app/auth/login/action.ts
"use server"

import { signIn } from "@/auth"
import { loginFormSchemaType } from "./page"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { v4 as uuid } from "uuid"

export const loginWithGithub = async () => {
	await signIn("github", {
		redirectTo: "/user",
	})
}

export const loginWithGoogle = async () => {
	await signIn("google", {
		redirectTo: "/user",
	})
}

export const loginWithCredentials = async (
	credentials: loginFormSchemaType
): Promise<void | { error?: string }> => {
	const existUser = await prisma.user.findUnique({
		where: {
			email: credentials.email,
		},
	})

	if (!existUser || !existUser.email) {
		return {
			error: "用户名不存在",
		}
	}

	if (!existUser.emailVerified) {
		const token = uuid()
		await sendEmail({
			to: existUser.email,
			subject: "注册成功",
			html: `点击激活账号 <a href="http://localhost:3000/auth/activate?token=${token}">激活</a>`,
		})
		return {
			error: "用户未激活，请激活后登录",
		}
	}

	try {
		await signIn("credentials", {
			...credentials,
			redirectTo: "/user",
		})
	} catch (error) {
		if (error instanceof AuthError) {
			return {
				error: "用户名或密码错误",
			}
		}

		// 这里一定要抛出异常，不然成功登录后不会重定向
		throw error
	}
}
