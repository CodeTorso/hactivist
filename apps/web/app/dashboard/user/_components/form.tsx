"use client"
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUploadFile } from "@repo/ui/hooks/use-upload-file";
import { FileUploader } from "../../../upload/file-uploader";
import { UploadedFilesCard } from "../../../upload/uploaded-files-card";
import { createReport } from "../../../server/actions";
import { getErrorMessage } from "../../../lib/handle-errors";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/src/form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/src/select";
import { Button } from "@repo/ui/src/button";

const acceptedFileTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const ImageSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 4 * 1024 * 1024,
    "Image size should be less than 4MB"
  )
  .refine(
    (file) => ["image/jpeg", "image/png"].includes(file.type),
    "Only JPEG and PNG files are allowed"
  );

const schema = z.object({
  images: z.array(ImageSchema).max(4, "Maximum 4 images allowed"),
  address: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  description: z.string().min(5).max(500),
  issue: z.enum([
    "light",
    "sewage",
    "water",
    "sanitaion",
    "crime",
    "miscellaneous",
  ]),
  phone: z.string().min(10).max(12).regex(/^\d+$/, "Must be a valid phone number"),
});

type Schema = z.infer<typeof schema>;

function CombinedComplaintForm({ userId, image }: { userId: string; image: string }) {
  const [loading, setLoading] = useState({state:false, message: "Submit"});
  const { uploadFiles, resetuploadedFiles, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
      issue: "light",
    },
  });
  useEffect(() => {
    if (!loading.state && loading.message === "Submit") {
      form.reset();
      setImageUrl([]);
      resetuploadedFiles()
    }
  }, [loading, form]);
  useEffect(() => {
    if (open) {
      form.reset();
      setImageUrl([]);
      resetuploadedFiles()
    }
  }, [open, form]);

  async function imageUpload(files: File[]){
    setLoading({state: true, message: "One Sec, Uploading Images..."});
    const res = await uploadFiles(files)
    const image = res.map((v)=> `https://bucket.torso.wtf/${encodeURIComponent(v.filename)}`)
    setImageUrl(image)
    setLoading({state: false, message: "Submit Now!"});
  }

  async function onSubmit(data: Schema) {
    setLoading({state: true, message: "submitting..."});
    try {
      await createReport({ ...data, userId, phone: parseInt(data.phone), image: imageUrl, userImage: image });
      form.reset();
      toast.success("Complaint submitted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading({state:false, message: "Submit" });
      setOpen(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-[#FEC887] hover:bg-[#FEC887]/80 text-base font-semibold">
          File a new Complaint
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white px-6 text-black dark">
        <DrawerHeader>
          <DrawerTitle>Create A Complaint</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-2 py-3">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="issue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[180px] bg-transparent border-gray-300 border-[1px]">
                          <SelectValue placeholder="Select an issue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#F6F2EB] border-gray-300 border-[1px]">
                        {["light", "sewage", "water", "sanitaion", "crime", "miscellaneous"].map((issue) => (
                          <SelectItem
                            key={issue}
                            value={issue}
                            className="text-black focus:text-black focus:bg-[#FCD09B]"
                          >
                            {issue.charAt(0).toUpperCase() + issue.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
                        placeholder="Phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-10 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="col-span-4 md:col-span-3">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
                        placeholder="City"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-6 md:col-span-7">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
                        placeholder="Address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="px-4 py-3 bg-transparent outline-none w-full border-gray-300 border-[1px] rounded-md"
                      placeholder="Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images (if needed)</FormLabel>
                  <FormControl>
                    {uploadedFiles.length > 0 ? (
                      <UploadedFilesCard uploadedFiles={uploadedFiles} />
                    ) : (
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        onUpload={imageUpload}
                        disabled={isUploading}
                        accept={acceptedFileTypes}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter>
              <Button
                className="bg-[#FEC887] hover:bg-[#FEC887]/80"
                type="submit"
                disabled={loading.state}
              >
                {loading.message}
              </Button>
              <DrawerClose>
                <Button
                  className="bg-transparent text-black w-full"
                  variant="outline"
                  type="button"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default CombinedComplaintForm;