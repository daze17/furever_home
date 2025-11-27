import { PetDetails } from "./pet_details";

export default async function PetDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <PetDetails id={params.id} />;
}
