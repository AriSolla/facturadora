export interface Producto {
  id: string;
  codigo: string; // código de barras
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}

export const productos: Producto[] = [
  // Bebidas
  { id: '1', codigo: '7790895000126', nombre: 'Coca Cola 2.25L', precio: 1850, categoria: 'Bebidas', stock: 50 },
  { id: '2', codigo: '7790315214569', nombre: 'Coca Cola 500ml', precio: 850, categoria: 'Bebidas', stock: 100 },
  { id: '3', codigo: '7790742000019', nombre: 'Sprite 2.25L', precio: 1750, categoria: 'Bebidas', stock: 30 },
  { id: '4', codigo: '7791813000129', nombre: 'Agua Villavicencio 2L', precio: 650, categoria: 'Bebidas', stock: 80 },
  
  // Yerba
  { id: '5', codigo: '7790387000528', nombre: 'Yerba Taragüi 1kg', precio: 3200, categoria: 'Infusiones', stock: 40 },
  { id: '6', codigo: '7790742007698', nombre: 'Yerba Rosamonte 1kg', precio: 2900, categoria: 'Infusiones', stock: 35 },
  { id: '7', codigo: '7790742000347', nombre: 'Yerba CBSé 500g', precio: 1800, categoria: 'Infusiones', stock: 60 },
  
  // Lácteos
  { id: '8', codigo: '7790315214897', nombre: 'Leche La Serenísima 1L', precio: 980, categoria: 'Lácteos', stock: 70 },
  { id: '9', codigo: '7790742000583', nombre: 'Yogur Sancor 190g', precio: 450, categoria: 'Lácteos', stock: 50 },
  { id: '10', codigo: '7791813002147', nombre: 'Queso Cremoso La Paulina 300g', precio: 2400, categoria: 'Lácteos', stock: 25 },
  
  // Snacks
  { id: '11', codigo: '7790742000965', nombre: 'Papas Lays 150g', precio: 1350, categoria: 'Snacks', stock: 45 },
  { id: '12', codigo: '7790387001235', nombre: 'Galletitas Oreo 118g', precio: 980, categoria: 'Snacks', stock: 55 },
];