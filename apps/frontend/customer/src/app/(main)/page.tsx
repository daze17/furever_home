import { cn } from "utils";

import Donation from "@/components/donation";
import Event from "@/components/event";
import { serverErrorMap } from "@/components/server_error";

// import AnimalsNeededSupportCarousel from "./animal_support_list_carousel";
import HeroSection from "./hero_section";
// import HomePetList from "./home_pet_list";

const accounts = [
  {
    name: "Хаан банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "Хас банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "XXБанк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
];

export const revalidate = 0;
const Home: React.Page = async () => {
  // const response = await client.pet.getPets({ query: {} });

  // if (response.status !== 200) {
  //   return serverErrorMap(response);
  // }

  return (
    <div className="bg-[#fbfbfb] pb-12">
      <HeroSection />
      <div className="container mx-auto space-y-8">
        <div className={cn("flex flex-col gap-10", "md:flex-row")}>
          <Donation accounts={accounts} />
          <Event />
        </div>
      </div>
    </div>
  );
};

export default Home;
