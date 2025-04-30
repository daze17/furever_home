// "use client";

// import { PetsResponse } from "api/furever-home";
// import Autoplay from "embla-carousel-autoplay";
// import { useRef } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "ui";

// import { SupportAnimalCard } from "./support_animal_card";

// type Props = {
//   data: PetsResponse[];
// };
// const AnimalsNeededSupportCarousel: React.FC<Props> = ({ data }) => {
//   const animals = [
//     {
//       petImage: "/animal_support.jpg",
//       name: "Poppy",
//       healthInformation: "healthy",
//       behavioralInformation: "happy",
//       speciesId: "dog",
//       birthDate: new Date(),
//       gender: "female",
//     },
//     {
//       petImage: "/animal_support.jpg",
//       name: "Poppy",
//       healthInformation: "healthy",
//       behavioralInformation: "happy",
//       speciesId: "dog",
//       birthDate: new Date(),
//       gender: "female",
//     },
//     {
//       petImage: "/animal_support.jpg",
//       name: "Poppy",
//       healthInformation: "healthy",
//       behavioralInformation: "happy",
//       speciesId: "dog",
//       birthDate: new Date(),
//       gender: "female",
//     },
//     {
//       petImage: "/animal_support.jpg",
//       name: "Poppy",
//       healthInformation: "healthy",
//       behavioralInformation: "happy",
//       speciesId: "dog",
//       birthDate: new Date(),
//       gender: "female",
//     },
//   ];

//   const plugin = useRef(
//     Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
//   );
//   return (
//     <div className="grid grid-cols-1 gap-10 rounded-3xl border-gray-100 bg-secondary-foreground p-5 md:grid-cols-3">
//       <h1 className="flex items-center justify-center text-center text-5xl font-bold text-gray-100 md:text-start">
//         {/* {"Эдгээр амьтадад та бидний тусламж хэрэгтэй байна. ❤️‍🩹 ❤️‍🩹 ❤️‍🩹"} */}
//         {"Тусламж хэрэгтэй амьтад ❤️‍🩹 ❤️‍🩹 ❤️‍🩹"}
//       </h1>
//       <div className="col-span-1 px-20 md:col-span-2">
//         <Carousel
//           opts={{
//             align: "start",
//           }}
//           plugins={[plugin.current]}
//         >
//           <CarouselContent>
//             {animals.map((animal, index) => (
//               <CarouselItem key={index} className="gap-20 lg:basis-1/2">
//                 <SupportAnimalCard animal={animal} />
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious />
//           <CarouselNext />
//         </Carousel>
//       </div>
//     </div>
//   );
// };

// export default AnimalsNeededSupportCarousel;
