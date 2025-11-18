import { c } from "@/contract";
import { authContract } from "./auth";
import { customerProfileContract } from "./customer";
import { petContract } from "./pet";

export const customerContract = c.router({
  auth: authContract,
  customer: customerProfileContract,
  pets: petContract,
});
