import { EditPet } from "./edit_pet";

export default function EditPetPage({ params }: { params: { id: string } }) {
  return <EditPet id={params.id} />;
}
