import { c } from "@/contract";
import { adoptionPostContract } from "./adoption_post";
import { authContract } from "./auth";
import { customerProfileContract } from "./customer";
import { customerSettingsContract } from "./customer_settings";
import { fileContract } from "./file";
import { petContract } from "./pet";

export const customerContract = c.router({
  adoptionPosts: adoptionPostContract,
  auth: authContract,
  customer: customerProfileContract,
  customerSettings: customerSettingsContract,
  pets: petContract,
  file: fileContract,
});
