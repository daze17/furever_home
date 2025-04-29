import * as customers from "./customers";
import * as customersAccounts from "./customer_accounts";
import * as customersSettings from "./customer_settings";
import * as pets from "./pets";
import * as petExtraInformations from "./pet_extra_informations";
import * as adoptionPosts from "./adoption_posts";
import * as adoptionTransactions from "./adoption_transactions";
import * as adoptionApplications from "./adoption_applications";
import * as petMedicalRecords from "./pet_medical_records";
import * as petPreferences from "./pet_preferences";
export * from "./customers";
export * from "./customer_accounts";
export * from "./customer_settings";
export * from "./pets";
export * from "./pet_extra_informations";
export * from "./adoption_transactions";
export * from "./adoption_posts";
export * from "./adoption_applications";
export * from "./pet_medical_records";
export * from "./pet_preferences";

export const schema = {
  ...customers,
  ...customersAccounts,
  ...customersSettings,
  ...pets,
  ...petExtraInformations,
  ...adoptionPosts,
  ...adoptionTransactions,
  ...adoptionApplications,
  ...petMedicalRecords,
  ...petPreferences,
};

export type Schema = typeof schema;
