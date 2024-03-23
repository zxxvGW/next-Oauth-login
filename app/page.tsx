import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"
import { loginWithGithub } from "./auth/login/action"

export default function Home({
	searchParams,
}: {
	searchParams: {
		error: string
	}
}) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex justify-center">
				{searchParams.error && (
					<p className=" text-red-500">{searchParams.error}</p>
				)}
			</div>
			<form action={loginWithGithub}>
				<Button>按钮</Button>
			</form>
		</main>
	)
}
