import { c } from "@/contract";
import { enumContract } from "./enum";

export const customerContract = c.router({
  enums: enumContract,
});
