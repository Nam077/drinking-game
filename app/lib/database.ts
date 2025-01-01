import { DataSource } from "typeorm";
import { Card } from "@/app/entities/Card";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  ssl: true,
  entities: [Card],
  synchronize: true,
}); 