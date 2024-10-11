import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CompraDeAcciones: React.FC = () => {
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');

  const handleCompra = () => {
    console.log('Comprando acciones:', { cantidad, precio });
    // Aquí iría la lógica para procesar la compra de acciones
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compra de Acciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="cantidad">Cantidad de Acciones</Label>
            <Input
              id="cantidad"
              placeholder="Ingrese la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="precio">Precio por Acción</Label>
            <Input
              id="precio"
              placeholder="Ingrese el precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleCompra} className="mt-4">Procesar Compra</Button>
      </CardContent>
    </Card>
  );
};

export default CompraDeAcciones;