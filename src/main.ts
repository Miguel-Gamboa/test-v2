import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as hbs from 'hbs';

// Helper para comparación
hbs.registerHelper('eq', (a: any, b: any) => a === b);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar method-override
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));

  // Configura la carpeta de vistas
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Servir archivos estáticos desde la carpeta public para CSS
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Servir archivos estáticos desde la carpeta uploads para imágenes
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  await app.listen(3000);
}
bootstrap();
