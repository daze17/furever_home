export default async function AdoptPetPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Adopt This Pet</h1>
      <p className="text-muted-foreground">
        Adoption application flow for pet ID: {params.id}
      </p>
      <p className="mt-4 text-yellow-600">
        ⚠️ Adoption system implementation pending (requires backend API)
      </p>
    </div>
  );
}
