import { c } from "@/contract";
import { authContract } from "./auth";
import { customerProfileContract } from "./customer";
import { customerSettingsContract } from "./customer_settings";
import { petContract } from "./pet";

export const customerContract = c.router({
  auth: authContract,
  customer: customerProfileContract,
  customerSettings: customerSettingsContract,
  pets: petContract,
});
