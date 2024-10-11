import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PagoDePrestamos: React.FC = () => {
  const [socio, setSocio] = useState('');
  const [monto, setMonto] = useState('');

  const handlePago = () => {
    console.log('Procesando pago de préstamo:', { socio, monto });
    // Aquí iría la lógica para procesar el pago del préstamo
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pago de Préstamos</CardTitle>
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
            <Label htmlFor="monto">Monto a Pagar</Label>
            <Input
              id="monto"
              placeholder="Ingrese el monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handlePago} className="mt-4">Procesar Pago</Button>
      </CardContent>
    </Card>
  );
};

export default PagoDePrestamos;