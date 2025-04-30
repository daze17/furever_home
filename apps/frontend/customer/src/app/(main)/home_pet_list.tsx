// import { PetsResponse } from "api/furever-home";
// import Link from "next/link";
// import { Button } from "ui";
// import { cn } from "utils";

// import { PetCard } from "@/components/pet_card";

// type Props = {
//   pets: PetsResponse[];
// };
// const HomePetList: React.FC<Props> = ({ pets }) => {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-center text-5xl font-bold uppercase">
//         {"Амьтан үрчлэх"}
//       </h1>
//       <div className="flex flex-col items-center">
//         <div
//           className={cn(
//             "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
//           )}
//         >
//           {pets.slice(0, 4).map((pet, index) => (
//             <PetCard key={index} pet={pet} />
//           ))}
//         </div>
//         <Button className="underline" variant={"ghost"} asChild>
//           <Link href="/pets">Цааш үзэх</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default HomePetList;
