import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface AgendaItem {
  id: number;
  content: string;
}

export default function AgendaSection({juntaId} : {juntaId: string}) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [editItem, setEditItem] = useState<AgendaItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgendaItems();
  }, []);

  const fetchAgendaItems = async () => {
    try {
      const response = await fetch(`/api/juntas/${juntaId}/agenda`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAgendaItems(data);
      }
    } catch (error) {
      console.error('Error fetching agenda items:', error);
    }
  };

  const handleAddItem = async (e : any) => {
    e.preventDefault();
    if (newItem.trim() === '') return;

    try {
      const response = await fetch(`/api/juntas/${juntaId}/agenda/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add authorization header if needed
        },
        body: JSON.stringify({ content: newItem, juntaId: juntaId}),
      });

      if (response.ok) {
        await fetchAgendaItems();
        setNewItem('');
        toast({
          title: "Punto de agenda añadido",
          description: "El nuevo punto de agenda se ha añadido exitosamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el punto de agenda.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!editItem || editItem.content.trim() === '') return;

    try {
      const response = await fetch(`/api/agenda`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editItem.content, id: editItem.id}),
      });

      if (response.ok) {
        await fetchAgendaItems();
        setEditItem(null);
        toast({
          title: "Punto de agenda actualizado",
          description: "El punto de agenda se ha actualizado exitosamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el punto de agenda.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/agenda`, {
        method: 'DELETE',
        body: JSON.stringify({ id: id}),
      });

      if (response.ok) {
        await fetchAgendaItems();
        toast({
          title: "Punto de agenda eliminado",
          description: "El punto de agenda se ha eliminado exitosamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el punto de agenda.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gestión de Agenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Nuevo punto de agenda"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {agendaItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between bg-secondary p-2 rounded">
              <span className="text-lg">{index + 1}. {item.content}</span>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar punto de agenda</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={editItem?.content || ''}
                      onChange={(e) => setEditItem(editItem ? { ...editItem, content: e.target.value } : null)}
                    />
                    <Button onClick={handleEditItem}>Guardar cambios</Button>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente este punto de agenda.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}