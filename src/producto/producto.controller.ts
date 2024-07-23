import { Controller, Get, Post, Body, Render, UseInterceptors, UploadedFile, Res, Param, Put, Delete, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { MarcaService } from '../marca/marca.service';
import { CategoriaService } from '../categoria/categoria.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('productos')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly marcaService: MarcaService,
    private readonly categoriaService: CategoriaService,
  ) {}

  @Get()
  @Render('producto-list')
  async getAllProducts(
    @Query('search') search?: string,
    @Query('marca') marca?: string,
    @Query('categoria') categoria?: string
  ) {
    const productos = await this.productoService.findAllWithDetails(search, marca, categoria);
    const marcas = await this.marcaService.findAll();
    const categorias = await this.categoriaService.findAll();
    
    return { 
      productos, 
      marcas, 
      categorias, 
      search, 
      selectedMarca: marca, 
      selectedCategoria: categoria 
    };
  }

  @Get('add')
  @Render('producto-add')
  async getAddForm() {
    const marcas = await this.marcaService.findAll();
    const categorias = await this.categoriaService.findAll();
    return { marcas, categorias };
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('imagen', {
    dest: './uploads',
  }))
  async addProduct(@Body() createProductoDto: CreateProductoDto, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (file) {
      createProductoDto.imagen = file.filename;
    }
    await this.productoService.create(createProductoDto);
    res.redirect('/productos');
  }

  @Get('edit/:id')
  @Render('producto-edit')
  async getEditForm(@Param('id') id: string) {
    const producto = await this.productoService.findOne(id);
    const marcas = await this.marcaService.findAll();
    const categorias = await this.categoriaService.findAll();
    return { producto, marcas, categorias };
  }

  @Post('edit/:id')
  @UseInterceptors(FileInterceptor('imagen', {
    dest: './uploads',
  }))
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    if (file) {
      updateProductoDto.imagen = file.filename;
    }
    try {
      await this.productoService.update(id, updateProductoDto);
      res.redirect('/productos');
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Error updating product');
    }
  }

  @Post(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Body('_method') method: string) {
    if (method === 'DELETE') {
      try {
        await this.productoService.remove(id);
        res.redirect('/productos');
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
      }
    } else {
      res.status(405).send('Method Not Allowed');
    }
  }

  @Get('search')
  async searchProductos(
    @Res() res: Response,
    @Query('search') search?: string,
    @Query('marca') marca?: string,
    @Query('categoria') categoria?: string
  ) {
    const productos = await this.productoService.findAllWithDetails(search, marca, categoria);
    res.render('producto-list-partial', { productos });
  }
}