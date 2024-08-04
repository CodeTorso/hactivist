import { Button } from "@repo/ui/src/button";
import { auth, signOut } from "../../server/auth";
import { redirect } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/src/drawer";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
  SelectGroup,
} from "@repo/ui/src/select";
import { createReport, GetUserReports } from "../../server/actions";
import { revalidatePath } from 'next/cache'


export const runtime = "edge";

async function page() {
  const user = await auth();

  if (!user?.user?.email) {
    return redirect("/");
  }

  const reports = await GetUserReports(user.user.id as string);

  async function create(formData: FormData) {
    "use server";
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const description = formData.get("description") as string;
    const phone = parseInt(formData.get("phone") as string);
    const issue = formData.get("issue") as
      | "light"
      | "sewage"
      | "water"
      | "sanitaion"
      | "crime"
      | "miscellaneous";
    const userId = user?.user?.id as string;

    createReport({ address, city, description, issue, phone, userId });
    revalidatePath('/dashboard/user');
    console.log({ address, city, description, issue, phone, userId });
  }

  return (
    <div className="h-screen bg-[#F6F2EB] text-black">
      <span>Hello {user.user.name} 👋</span>

      <Drawer>
        <DrawerTrigger asChild>
          <Button className="bg-[#FEC887] hover:bg-[#FEC887]/80 text-base font-semibold">
            File a new Complaint
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white px-6 text-black dark">
          <DrawerHeader>
            <DrawerTitle>Create A Complaint</DrawerTitle>
          </DrawerHeader>
          <form className="space-y-3" action={create}>
            <label htmlFor="issue">Issue</label>
            <Select name="issue" defaultValue="light">
              <SelectTrigger id="issue" className="w-[180px] bg-transparent">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent className="bg-[#F6F2EB]">
                <SelectGroup>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="light">Light</SelectItem>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="sewage">Sewage</SelectItem>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="water">Water</SelectItem>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="sanitaion">Sanitaion</SelectItem>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="crime">Crime</SelectItem>
                  <SelectItem className="text-black focus:text-black focus:bg-[#FCD09B]" value="miscellaneous">Miscellaneous</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <label htmlFor="city">City</label>
            <input
              id="city"
              className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
              name="city"
              placeholder="City"
            />
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
              name="address"
              placeholder="Address"
            />
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
              name="description"
              placeholder="Description"
            />
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
              name="phone"
              placeholder="Phone"
            />
            <DrawerFooter>
              <Button type="submit">Submit</Button>
              <DrawerClose>
                <Button className="bg-transparent text-black" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      {reports?.map((v, i) => (
        <div key={i}>
          <div>{v.city}</div>
          <div>{v.address}</div>
          <div>{v.description}</div>
          <div>{v.issue}</div>
          <div>{v.phone}</div>
        </div>
      ))}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button className="mt-4">Sign out</Button>
      </form>
    </div>
  );
}

export default page;
