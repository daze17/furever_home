import "dotenv/config";

export const env = {
  db: {
    url: process.env.DATABASE_URL!,
  },
};
