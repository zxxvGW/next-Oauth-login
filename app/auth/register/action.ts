"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { RegisterFormSchemaType } from "./page"
import { sendEmail } from "@/lib/email"
import { v4 as uuid } from "uuid"

export const register = async (data: RegisterFormSchemaType) => {
	console.log(new Date(Date.now()))
	return
	const existUser = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	})

	if (existUser) {
		return {
			error: "当前邮箱已存在！",
		}
	}

	// 给密码加盐，密码明文存数据库不安全
	const hashedPassword = await bcrypt.hash(data.password, 10)

	await prisma.user.create({
		data: {
			name: data.username,
			password: hashedPassword,
			email: data.email,
		},
	})
	const token = uuid()

	// 数据中生成一个验证token，过期时间为1小时
	await prisma.verificationToken.create({
		data: {
			identifier: data.email,
			token,
			expires: new Date(Date.now() + 60 * 60 * 1000),
		},
	})

	// await sendEmail({
	// 	to: data.email,
	// 	subject: "注册成功",
	// 	html: `点击激活账号 <a href="http://localhost:3000/auth/activate?token=${token}">激活</a>`,
	// })
}
