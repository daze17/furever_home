import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { MedicalRecordForm } from "./medical_record_form";

type Props = {
  id: number;
};

const MedicalRecordPage: React.Page<Props> = async (props) => {
  const { id } = await props.params;

  const response = await client.pets.getOwnPet({
    params: { id },
  });

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Алдаа"} text={"Алдаа гарлаа"} className="mb-18">
        <Link
          href="/my_pets"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Миний тэжээвэр амьтад руу буцах"}
        </Link>
      </ErrorCard>
    );
  }

  return (
    <MedicalRecordForm
      petId={id}
      existingRecord={response.body.pet_medical_records}
    />
  );
};

export default MedicalRecordPage;
