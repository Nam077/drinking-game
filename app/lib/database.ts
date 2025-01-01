import "reflect-metadata";
import { DataSource } from "typeorm";
import { Card } from "../entities/Card";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // Chỉ dùng true trong môi trường development
  logging: true,
  entities: [Card], // Thêm các entity khác vào đây
  migrations: [],
  subscribers: [],
});

let initialized = false;

export async function initializeDatabase() {
  if (!initialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      initialized = true;
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
  return AppDataSource;
} 