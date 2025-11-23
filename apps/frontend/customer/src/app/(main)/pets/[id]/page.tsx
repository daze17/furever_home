import { PetDetails } from "./pet_details";

export default function PetDetailPage({ params }: { params: { id: string } }) {
  return <PetDetails id={params.id} />;
}
