export default async function AdoptPetPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Энэ тэжээвэр амьтныг үрчлэх</h1>
      <p className="text-muted-foreground">
        Тэжээвэр амьтны ID-ийн үрчлэлийн хүсэлтийн үйл явц: {params.id}
      </p>
      <p className="mt-4 text-yellow-600">
        ⚠️ Үрчлэлийн системийн хэрэгжилт хүлээгдэж байна (backend API шаардлагатай)
      </p>
    </div>
  );
}
