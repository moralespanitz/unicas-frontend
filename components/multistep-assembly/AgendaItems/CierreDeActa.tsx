import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const CierreDeActa: React.FC = () => {
  const [resumen, setResumen] = useState('');

  const handleCierreActa = () => {
    console.log('Cerrando acta:', resumen);
    // Aquí iría la lógica para cerrar el acta
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cierre de Acta</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Ingrese el resumen de las actividades realizadas..."
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleCierreActa}>Cerrar Acta</Button>
      </CardContent>
    </Card>
  );
};

export default CierreDeActa;