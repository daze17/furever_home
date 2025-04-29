import { c } from "@/contract";
import { authContract } from "./auth";

export const customerContract = c.router({
  auth: authContract,
});
