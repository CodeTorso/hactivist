import React from "react";
import { auth, signIn, signOut } from "../server/auth";
import { redirect } from "next/navigation";
import { Button } from "@repo/ui/src/button";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import Form from "./_components/form";
import { serveAdmin } from "../server/actions";

export const runtime = "edge";

async function page() {
  const user = await auth();

  function createAdmin(key:string){
    serveAdmin({userId: user?.user?.id as string, key: key})
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#F6F2EB] text-black">
      <div className="relative overflow-hidden">
        <div className="max-w-md w-full bg-white py-8 rounded-2xl">
          <div className="text-center space-y-8 px-12">
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold">Create Admin</h1>
              <h3 className="text-lg">
                {user?.user?.email ? (
                  <div>
                    <p>
                      Using {user.user.email}{" "}
                      <form
                        title="Sign Out."
                        className="text-black text-lg font-normal underline inline cursor-pointer"
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/a" });
                        }}
                      >
                        [X]
                      </form>{" "}
                      for admin login.
                    </p>
                  </div>
                ) : (
                  <p>First Login with a account you want to make admin.</p>
                )}
              </h3>
            </div>
            {user?.user?.email ? (
              <Form userId={user.user.id as string} />
            ) : (
              <div className="flex gap-4">
                <form
                  className="w-full"
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/a" });
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
                    <FaFacebook />
                    Facebook
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
export default page;
