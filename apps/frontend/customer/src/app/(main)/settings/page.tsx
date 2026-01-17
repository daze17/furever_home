import { client } from "@/services/client.server";

import SettingsForm from "./settings_form";

const SettingsPage = async () => {
  const response = await client.customerSettings.getCustomerSettings();

  if (response.status === 404) {
    // Settings should exist for all users, but handle gracefully
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Тохиргоо олдсонгүй</h1>
          <p className="text-muted-foreground">
            Энэ асуудал үргэлжилвэл тусламжийн төвтэй холбогдоно уу.
          </p>
        </div>
      </div>
    );
  }

  if (response.status !== 200) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Тохиргоо ачааллахад алдаа гарлаа
          </h1>
          <p className="text-muted-foreground">Дахин оролдоно уу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Тохиргоо</h1>
      <SettingsForm initialSettings={response.body} />
    </div>
  );
};

export default SettingsPage;
