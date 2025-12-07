import { getSession } from "@/utils/get_session";
import { PetDetails } from "./pet_details";

export default async function PetDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  // Fetch session to get current user (null if not authenticated)
  const session = await getSession();
  const currentUserId = session?.sub ?? null;

  return <PetDetails id={params.id} currentUserId={currentUserId} />;
}
