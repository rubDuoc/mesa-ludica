import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { Producto, Categoria } from '../../models/producto';

/**
 * @description
 * Panel de administración (solo rol `admin`, protegido por `adminGuard`).
 * Incluye el mantenedor de productos: permite registrar, editar y eliminar
 * juegos del catálogo y ver el inventario (stock) en una tabla.
 */
@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  /** Servicio de autenticación para saludar al administrador conectado. */
  protected readonly auth = inject(AuthService);

  /** Servicio de productos (catálogo reactivo y operaciones CRUD). */
  protected readonly productoService = inject(ProductoService);

  /** Categorías disponibles para el selector del formulario. */
  protected readonly categorias: Categoria[] = this.productoService.getCategorias();

  /** Formulario reactivo del mantenedor de productos. */
  formulario: FormGroup;

  /** Se pone en true al intentar guardar, para desplegar los errores. */
  enviado = false;

  /** Id del producto en edición; null si se está creando uno nuevo. */
  editandoId: string | null = null;

  /** true mientras se arrastra una imagen sobre la zona de carga. */
  arrastrando = false;

  /** Mensaje de confirmación tras guardar (vacío si no hay que mostrarlo). */
  mensajeExito = '';

  /**
   * @param fb Constructor de formularios reactivos de Angular.
   */
  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre:         ['', [Validators.required, Validators.minLength(3)]],
      categoria:      ['', [Validators.required]],
      precio:         [0,  [Validators.required, Validators.min(1)]],
      precio_antiguo: [null as number | null],
      stock:          [0,  [Validators.required, Validators.min(0)]],
      imagen:         ['', [Validators.required]],
      descripcion:    ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /** Acceso directo al control nombre. */
  get nombre()      { return this.formulario.get('nombre')!; }
  /** Acceso directo al control categoria. */
  get categoria()   { return this.formulario.get('categoria')!; }
  /** Acceso directo al control precio. */
  get precio()      { return this.formulario.get('precio')!; }
  /** Acceso directo al control stock. */
  get stock()       { return this.formulario.get('stock')!; }
  /** Acceso directo al control imagen. */
  get imagen()      { return this.formulario.get('imagen')!; }
  /** Acceso directo al control descripcion. */
  get descripcion() { return this.formulario.get('descripcion')!; }

  /**
   * Guarda el producto: lo crea o lo actualiza según si se está editando.
   */
  guardar(): void {
    this.enviado = true;
    this.mensajeExito = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.value;
    const datos: Omit<Producto, 'id'> = {
      nombre: v.nombre,
      categoria: v.categoria as Producto['categoria'],
      precio: Number(v.precio),
      precio_antiguo: v.precio_antiguo ? Number(v.precio_antiguo) : null,
      stock: Number(v.stock),
      imagen: v.imagen,
      descripcion: v.descripcion
    };

    const esEdicion = this.editandoId !== null;
    if (esEdicion) {
      this.productoService.actualizarProducto({ ...datos, id: this.editandoId! });
    } else {
      this.productoService.agregarProducto(datos);
    }
    this.cancelar();
    this.mensajeExito = esEdicion
      ? `✔ Producto "${datos.nombre}" actualizado correctamente.`
      : `✔ Producto "${datos.nombre}" agregado al inventario.`;
  }

  /**
   * Carga un producto en el formulario para editarlo.
   * @param producto Producto a editar.
   */
  editar(producto: Producto): void {
    this.editandoId = producto.id;
    this.enviado = false;
    this.mensajeExito = '';
    this.formulario.setValue({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      precio_antiguo: producto.precio_antiguo,
      stock: producto.stock,
      imagen: producto.imagen,
      descripcion: producto.descripcion
    });
  }

  /**
   * Elimina un producto del catálogo.
   * @param id Id del producto a eliminar.
   */
  eliminar(id: string): void {
    this.productoService.eliminarProducto(id);
    if (this.editandoId === id) {
      this.cancelar();
    }
  }

  /** Limpia el formulario y sale del modo edición. */
  cancelar(): void {
    this.formulario.reset({ precio: 0, stock: 0, precio_antiguo: null });
    this.editandoId = null;
    this.enviado = false;
  }

  /**
   * Maneja la imagen elegida con el selector de archivos.
   * @param evento Evento change del input file.
   */
  onFileSelected(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.leerArchivo(input.files?.[0]);
  }

  /**
   * Maneja la imagen soltada sobre la zona de arrastre.
   * @param evento Evento drop con el archivo arrastrado.
   */
  onDrop(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando = false;
    this.leerArchivo(evento.dataTransfer?.files?.[0]);
  }

  /**
   * Resalta la zona mientras se arrastra una imagen encima.
   * @param evento Evento dragover.
   */
  onDragOver(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando = true;
  }

  /**
   * Quita el resaltado cuando la imagen sale de la zona.
   * @param evento Evento dragleave.
   */
  onDragLeave(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando = false;
  }

  /**
   * Lee un archivo de imagen y lo guarda en el formulario como Data URL (Base64).
   * @param archivo Archivo seleccionado o arrastrado.
   */
  private leerArchivo(archivo: File | undefined): void {
    if (!archivo || !archivo.type.startsWith('image/')) {
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      this.imagen.setValue(lector.result as string);
      this.imagen.markAsDirty();
      this.imagen.markAsTouched();
    };
    lector.readAsDataURL(archivo);
  }
}
