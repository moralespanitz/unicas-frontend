import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface AgendaItem {
  id: string;
  title: string;
  completed: boolean;
}

const AgendaAssemblySection: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { id: 'acta-previa', title: 'Acta Previa', completed: false },
    { id: 'compra-acciones', title: 'Compra de Acciones', completed: false },
    { id: 'pago-prestamos', title: 'Pago de Préstamos', completed: false },
    { id: 'solicitudes-prestamos', title: 'Solicitudes de Préstamos', completed: false },
    { id: 'registro-prestamos', title: 'Registro de Préstamos', completed: false },
    { id: 'cierre-acta', title: 'Cierre de Acta', completed: false },
  ]);

  const handleItemCompletion = (id: string) => {
    setAgendaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleConfirmCierre = () => {
    console.log('Confirmando cierre de acta');
    // Lógica para confirmar el cierre del acta
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda de la Asamblea</CardTitle>
      </CardHeader>
      <CardContent>
        {agendaItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={() => handleItemCompletion(item.id)}
            />
            <label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.title}
            </label>
          </div>
        ))}
        <Button 
          onClick={handleConfirmCierre}
          disabled={!agendaItems.every(item => item.completed)}
          className="mt-4"
        >
          Confirmar Cierre de Acta
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgendaAssemblySection;