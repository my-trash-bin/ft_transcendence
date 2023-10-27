import { Server } from "node:http";

import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

import { AppModule } from "./app.module";

let app: INestApplication;

export async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix("api/v1");
    await app.init();
  }

  return app;
}

export async function getListener() {
  const app = await getApp();
  const server: Server = app.getHttpServer();
  const [listener] = server.listeners("request");

  return listener;
}
