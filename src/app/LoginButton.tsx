'use client'
import { signIn, signOut, useSession } from "next-auth/react"

const LoginButton = () => {
    const { data: session } = useSession();
  return (
    <div className="ml-auto, flex gap-2">
        {session?.user ? (
            <>
            <button onClick={() => signOut()}>
                Sign Out
            </button>
            </>
        ) :(
            <button className="bg-white" onClick={() => signIn()}>
                Sign In
            </button>
        )}
    </div>
  )
}
export default LoginButton;