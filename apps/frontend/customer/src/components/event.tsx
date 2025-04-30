import Image from "next/image";
import { cn } from "utils";

const Event: React.FC = () => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start rounded-lg bg-primary-foreground px-8 shadow-md",
      )}
    >
      <h1 className="p-8 text-center text-3xl font-bold md:text-5xl">Эвэнт</h1>
      <Image
        src={"/pet_event.png"}
        alt="pet gathering event"
        width={500}
        height={500}
        className="rounded-lg object-contain pb-10"
      />
    </div>
  );
};

export default Event;
