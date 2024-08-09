import { ScrollArea, ScrollBar } from "@repo/ui/src/scroll-area";
import { LocationIcon } from "./svg";
import Response from "./response";

type Ireport = {
  image: string | null;
  images: string[];
  issue: "light" | "sewage" | "water" | "sanitaion" | "crime" | "miscellaneous";
  address: string;
  city: string;
  description: string;
  phone: number | null;
  id: number;
  status: "pending" | "resolved" | "dismissed";
  userId: string;
  resolved: Date | null;
  created: Date;
};

function CardContainer({ reports }: { reports: Ireport[] }) {
  return (
    <div className="space-y-4">
      {reports?.map((v, i) => <Card data={v} key={i} />)}
    </div>
  );
}

function Card({ data }: { data: Ireport }) {
  const { address, city, issue, description, status, images, image, resolved } = data;

  return (
    <div className="bg-[#FEC887]/20 px-5 py-3 rounded-3xl overflow-hidden">
      <div>
        <div className="flex gap-3">
          <img
            className="h-12 rounded-full select-none"
            src={image as string}
            height={20}
            alt="user"
          />
          <div>
            <h3 className="text-lg font-semibold leading-tight">{issue}</h3>
            <h2 className="text-gray-800 flex items-center">
              <LocationIcon /> {address}, {city}
            </h2>
          </div>
          <div className="flex items-center ml-auto">
            <span
              className={`text-sm text-${status === "resolved" ? "green-600" : "red-600"}`}
            >
              {status === "" && <Response message={resolved} />}
              {status}
            </span>
          </div>
        </div>
        <div className="py-4">{description}</div>
      </div>
      <ScrollArea>
        <div className="flex w-max space-x-2.5 h-[24vh]">
          {images.map((v, index) => (
            <img
              key={index}
              src={v}
              alt={`Image ${index + 1}`}
              className="inline my-3"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export default CardContainer;
