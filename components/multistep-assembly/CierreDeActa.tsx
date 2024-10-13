import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CierreDeActaProps {
  assemblyData: {
    attendance: any[];
    agenda: any[];
    compraAcciones: any[];
    pagoPrestamos: any[];
    solicitudesPrestamos: any[];
  };
  onSaveAssembly: () => void;
}

const CierreDeActa: React.FC<CierreDeActaProps> = ({ assemblyData, onSaveAssembly }) => {
  const [resumenAsistencia, setResumenAsistencia] = useState('');
  const [resumenAgenda, setResumenAgenda] = useState('');
  const [resumenCompraAcciones, setResumenCompraAcciones] = useState('');
  const [resumenPagoPrestamos, setResumenPagoPrestamos] = useState('');
  const [resumenSolicitudesPrestamos, setResumenSolicitudesPrestamos] = useState('');

  useEffect(() => {
    setResumenAsistencia(`Total de asistentes: ${assemblyData.attendance.length}`);
    setResumenAgenda(`Puntos de agenda tratados: ${assemblyData.agenda.length}`);
    setResumenCompraAcciones(`Total de acciones compradas: ${assemblyData.compraAcciones.reduce((sum: number, item: any) => sum + item.quantity, 0)}`);
    setResumenPagoPrestamos(`Total de pagos realizados: ${assemblyData.pagoPrestamos.length}`);
    setResumenSolicitudesPrestamos(`Total de solicitudes de préstamos: ${assemblyData.solicitudesPrestamos.length}`);
  }, [assemblyData]);

  const handleCierreActa = () => {
    // Aquí podrías agregar lógica adicional antes de guardar
    onSaveAssembly();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cierre de Acta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="asistencia">Resumen de Asistencia</Label>
          <Textarea
            id="asistencia"
            value={resumenAsistencia}
            onChange={(e) => setResumenAsistencia(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="agenda">Resumen de Agenda</Label>
          <Textarea
            id="agenda"
            value={resumenAgenda}
            onChange={(e) => setResumenAgenda(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="compraAcciones">Resumen de Compra de Acciones</Label>
          <Textarea
            id="compraAcciones"
            value={resumenCompraAcciones}
            onChange={(e) => setResumenCompraAcciones(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pagoPrestamos">Resumen de Pago de Préstamos</Label>
          <Textarea
            id="pagoPrestamos"
            value={resumenPagoPrestamos}
            onChange={(e) => setResumenPagoPrestamos(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="solicitudesPrestamos">Resumen de Solicitudes/Registro de Préstamos</Label>
          <Textarea
            id="solicitudesPrestamos"
            value={resumenSolicitudesPrestamos}
            onChange={(e) => setResumenSolicitudesPrestamos(e.target.value)}
          />
        </div>
        <Button onClick={handleCierreActa}>Cerrar Acta</Button>
      </CardContent>
    </Card>
  );
};

export default CierreDeActa;
