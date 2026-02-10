import { useNavigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Settings,
  FileText,
  Package,
  TestTube
} from 'lucide-react';
import logo from '@/assets/logo.png';

export function Home() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: '/pos',
      title: 'Punto de Venta',
      icon: ShoppingCart,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Iniciar nueva venta'
    },
    {
      id: '/ventas',
      title: 'Ventas',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Ver historial de ventas'
    },
    {
      id: '/productos',
      title: 'Productos',
      icon: Package,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Gestionar productos'
    },
    {
      id: '/configuracion',
      title: 'Configuración',
      icon: Settings,
      color: 'bg-slate-500 hover:bg-slate-600',
      description: 'Ajustes del sistema'
    },
    {
      id: '/test',
      title: 'Test Sync',
      icon: TestTube,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: 'Debug y sincronización'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <div className="p-6">
        <div className="mb-6">
          <div className="py-8 text-center flex flex-col items-center">
            <img
              src={logo}
              alt="POS"
              className="w-20 h-20 object-contain mb-4"
            />
            <p className="text-slate-600 mt-1">Sistema de punto de venta</p>
          </div>
        </div>
        {/* Menú de opciones */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(item.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 ${item.color} rounded-xl flex items-center justify-center transition-colors`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}