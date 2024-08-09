import { Button } from "@repo/ui/src/button";
import { auth, signOut } from "../../server/auth";
import { redirect } from "next/navigation";
import { GetUserReports } from "../../server/actions";
import CombinedComplaintForm from "./_components/form";
import { ScrollArea, ScrollBar } from "@repo/ui/src/scroll-area";
import CardContainer from "./_components/card";

export const runtime = "edge";

async function page() {
  const user = await auth();

  if (!user?.user?.email) {
    return redirect("/");
  }

  const reports = await GetUserReports(user.user.id as string);

  return (
    <div className="h-screen max-w-3xl w-full px-4 mx-auto pt-8 dark">
      <div className="flex justify-between items-center py-4">
        <span>Hello {user.user.name} 👋</span>

        <div className="flex gap-3 items-center">
          <CombinedComplaintForm image={user.user.image as string} userId={user.user.id as string} />

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button variant="outline" className="bg-transparent hover:bg-[#FEC887]/80 hover:text-black">Sign out</Button>
          </form>
        </div>
      </div>
      <CardContainer reports={reports} />

      <h3 className="text-center mt-72 pb-8">@hactivist 2024 ~ A Hactivism Project</h3>
    </div>
  );
}

export default page;
