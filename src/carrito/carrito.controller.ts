import { Controller, Get, Render } from '@nestjs/common';

@Controller('carrito')
export class CarritoController {
  @Get()
  @Render('carrito')
  mostrarCarrito() {
    return { message: 'Esta es la página del carrito' };
  }
}