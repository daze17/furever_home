import { c } from "@/contract";
import { authContract } from "./auth";
import { customerProfileContract } from "./customer";

export const customerContract = c.router({
  auth: authContract,
  customer: customerProfileContract,
});
