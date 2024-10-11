import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const SolicitudesDePrestamos: React.FC = () => {
  const [socio, setSocio] = useState('');
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSolicitud = () => {
    console.log('Procesando solicitud de préstamo:', { socio, monto, motivo });
    // Aquí iría la lógica para procesar la solicitud del préstamo
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Préstamos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="socio">Socio</Label>
            <Select onValueChange={setSocio}>
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
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="motivo">Motivo del Préstamo</Label>
            <Textarea
              id="motivo"
              placeholder="Ingrese el motivo del préstamo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSolicitud} className="mt-4">Enviar Solicitud</Button>
      </CardContent>
    </Card>
  );
};

export default SolicitudesDePrestamos;