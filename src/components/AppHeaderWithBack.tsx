import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, ArrowLeft, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface AppHeaderWithBackProps {
  title: string;
}

export function AppHeaderWithBack({ title }: AppHeaderWithBackProps) {
  const navigate = useNavigate();
  const { isOnline, ultimaSync } = useApp();

  const formatearFecha = (fecha: Date | null) => {
    if (!fecha) return 'Nunca';

    // const ahora = new Date();
    // const diffMinutos = Math.floor((ahora.getTime() - fecha.getTime()) / 60000);

    // if (diffMinutos < 1) return 'Hace menos de 1 min';
    // if (diffMinutos === 1) return 'Hace 1 minuto';
    // if (diffMinutos < 60) return `Hace ${diffMinutos} minutos`;

    // const diffHoras = Math.floor(diffMinutos / 60);
    // if (diffHoras === 1) return 'Hace 1 hora';
    // if (diffHoras < 24) return `Hace ${diffHoras} horas`;

    // return fecha.toLocaleDateString();
    return fecha.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm p-4">
      <div className="relative flex items-center">
        {/* IZQUIERDA */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* TÍTULO CENTRADO REAL */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-slate-900">
          {title}
        </h1>

        {/* DERECHA */}
        <div className="ml-auto">
          <div className="flex flex-col gap-2 items-end">
            {/* WiFi status */}
            {isOnline ? (
              <Badge className="bg-green-500 text-xs w-fit">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs w-fit">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}

            {/* Última sync */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <RefreshCw className="h-3 w-3" />
              <span>Última sync: {formatearFecha(ultimaSync)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}