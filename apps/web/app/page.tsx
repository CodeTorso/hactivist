import { Button } from "@repo/ui/src/button";
import { auth, signIn } from "./server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export const runtime = "edge";

export default async function Page() {
  const usr = await auth();

  if (usr?.user?.email) {
    redirect("/dashboard/user");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#F6F2EB] text-black">
      <div className="max-w-md w-full bg-white px-12 py-8 rounded-2xl">
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold">Agent Login</h1>
            <h3 className="text-lg px-10">
              hey, Enter your details to get into your account.
            </h3>
          </div>

          <div className="space-y-4">
            <input
              className="px-4 py-3 outline-none w-full border-gray-300 border-[1px] rounded-md"
              placeholder="Username"
              type="text"
            />
            <input
              className="px-4 py-3 outline-none w-full border-gray-300 border-[1px] rounded-md"
              placeholder="Password"
            />
            <Button className="bg-[#FEC887] hover:bg-[#FEC887]/80 text-base font-semibold w-full">
              Sign In
            </Button>
          </div>

          <div>~ or sign in with ~</div>

          <div className="flex gap-4">
            <form
						className="w-full"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard/user" });
              }}
            >
              <Button className="bg-transparent w-full flex gap-1  border-gray-300 border-[1px] text-lg">
                <FaGoogle />
                Google
              </Button>
            </form>
            <form
						className="w-full"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard/user" });
              }}
            >
              <Button className="bg-transparent w-full flex gap-1 border-gray-300 border-[1px] text-lg">
							<FaFacebook />Facebook
              </Button>
            </form>
          </div>

          <div>
            Don't Have an account?{" "}
            <Link className="font-semibold" href="">
              request now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
