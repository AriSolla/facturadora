import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { AppHeaderWithBack } from './AppHeaderWithBack';

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            <AppHeaderWithBack title="Mi Pantalla" />

            <div className="p-6">
                <div className="flex items-center justify-center p-6">
                    <Card className="max-w-md w-full">
                        <CardContent className="py-12 text-center">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
                            <p className="text-slate-600 mb-6">
                                Esta pantalla todavía no existe
                            </p>

                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={() => navigate(-1)}
                                    variant="outline"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Button>
                                <Button
                                    onClick={() => navigate('/')}
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Ir al inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}