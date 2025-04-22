import * as customers from "./customers";
import * as customersAccounts from "./customer_accounts";
import * as pets from "./pets";
import * as petExtraInformations from "./pet_extra_informations";
import * as adoptionTransactions from "./adoption_transactions";
import * as adoptionApplications from "./adoption_applications";
import * as petMedicalRecords from "./pet_medical_records";
import * as petPreferences from "./pet_preferences";

export const schema = {
  ...customers,
  ...customersAccounts,
  ...pets,
  ...petExtraInformations,
  ...adoptionTransactions,
  ...adoptionApplications,
  ...petMedicalRecords,
  ...petPreferences,
};

export type Schema = typeof schema;
