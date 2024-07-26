import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Producto } from './models/producto.model';
import { Marca } from './models/marca.model';
import { Categoria } from './models/categoria.model';
import { CarritoModule } from './carrito/carrito.module';

import { ProductoController } from './producto/producto.controller';
import { ProductoService } from './producto/producto.service';

import { CategoriaController } from './categoria/categoria.controller';
import { CategoriaService } from './categoria/categoria.service';

import { MarcaController } from './marca/marca.controller';
import { MarcaService } from './marca/marca.service';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app/app.controller';

import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    CarritoModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: true,
        models: [Producto, Marca, Categoria],
      }),
    }),
    SequelizeModule.forFeature([Producto, Marca, Categoria]),
    AuthModule,
    MailModule,
  ],
  controllers: [
    AppController,
    ProductoController,
    CategoriaController,
    MarcaController,
  ],
  providers: [
    AppService,
    ProductoService,
    CategoriaService,
    MarcaService,
  ],
})
export class AppModule {}

