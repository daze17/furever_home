// Export all schemas from consolidated files
export * from "./schemas";
export * from "./relations";

// Export enums
export * from "./enums";

// Import everything for the schema object
import * as schemas from "./schemas";
import * as relations from "./relations";

// Export combined schema object for Drizzle
export const schema = {
  ...schemas,
  ...relations,
};

export type Schema = typeof schema;
