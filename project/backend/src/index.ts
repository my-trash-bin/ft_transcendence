import { Server } from 'node:http';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { GraphQLModule } from './frontend/graphql/graphql.module';
import { AppModule } from './frontend/v1/app.module';

let app: INestApplication;

export async function getV1App() {
  if (!app) {
    app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix('api/v1');
    await app.init();
  }

  return app;
}

export async function getV1Listener() {
  const app = await getV1App();
  const server: Server = app.getHttpServer();
  const [listener] = server.listeners('request');

  return listener;
}

export async function getGraphQLApp() {
  if (!app) {
    app = await NestFactory.create(GraphQLModule, { bodyParser: false });
    app.setGlobalPrefix('api/graphql');
    await app.init();
  }

  return app;
}

export async function getGraphQLListener() {
  const app = await getGraphQLApp();
  const server: Server = app.getHttpServer();
  const [listener] = server.listeners('request');

  return listener;
}
