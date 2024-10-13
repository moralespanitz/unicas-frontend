import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import RegistroDePrestamos from './RegistroDePrestamos'

interface SolicitudesDePrestamosProps {
  juntaId: string;
  solicitudesPrestamos: any[]; // Ajusta este tipo según la estructura de tus datos
  onSolicitudesPrestamosChange: (solicitudesPrestamos: any[]) => void;
}

const SolicitudesDePrestamos: React.FC<SolicitudesDePrestamosProps> = ({ juntaId, solicitudesPrestamos, onSolicitudesPrestamosChange }) => {
  const [socio, setSocio] = useState('');
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSocioChange = (value: string) => {
    setSocio(value);
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(e.target.value);
  };

  const handleMotivoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMotivo(e.target.value);
  };

  const handleSolicitud = async () => {
    console.log('Procesando solicitud de préstamo:', { socio, monto, motivo });
    // Aquí iría la lógica para procesar la solicitud del préstamo
    if (response.ok) {
      const newSolicitud = await response.json();
      onSolicitudesPrestamosChange([...solicitudesPrestamos, newSolicitud]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="socio">Socio</Label>
              <Select onValueChange={handleSocioChange}>
                <SelectTrigger id="socio">
                  <SelectValue placeholder="Seleccione un socio" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="socio1">Socio 1</SelectItem>
                  <SelectItem value="socio2">Socio 2</SelectItem>
                  <SelectItem value="socio3">Socio 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="monto">Monto Solicitado</Label>
              <Input
                id="monto"
                placeholder="Ingrese el monto"
                value={monto}
                onChange={handleMontoChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="motivo">Motivo del Préstamo</Label>
              <Textarea
                id="motivo"
                placeholder="Ingrese el motivo del préstamo"
                value={motivo}
                onChange={handleMotivoChange}
              />
            </div>
          </div>
          <Button onClick={handleSolicitud} className="mt-4">Enviar Solicitud</Button>
        </CardContent>
      </Card>
      <RegistroDePrestamos />
    </>
  );
};

export default SolicitudesDePrestamos;
