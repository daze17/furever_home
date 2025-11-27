import { EditPet } from "./edit_pet";

export default async function EditPetPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <EditPet id={params.id} />;
}
