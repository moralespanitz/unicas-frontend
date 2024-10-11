import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const ActaPrevia: React.FC = () => {
  const [actaContent, setActaContent] = useState('');

  const handleSaveActa = () => {
    console.log('Guardando acta previa:', actaContent);
    // Aquí iría la lógica para guardar el acta previa
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acta Previa</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Ingrese el contenido del acta previa aquí..."
          value={actaContent}
          onChange={(e) => setActaContent(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSaveActa}>Guardar Acta Previa</Button>
      </CardContent>
    </Card>
  );
};

export default ActaPrevia;