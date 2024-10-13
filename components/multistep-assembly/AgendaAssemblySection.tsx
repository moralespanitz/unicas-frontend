import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

interface AgendaAssemblySectionProps {
  juntaId: string;
  agenda: AgendaItem[];
  onAgendaChange: (agenda: AgendaItem[]) => void;
}

const AgendaAssemblySection: React.FC<AgendaAssemblySectionProps> = ({ juntaId, agenda, onAgendaChange}) => {
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Agenda de la Asamblea</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
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
              {agenda.length > 0 ? (
                agenda.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between bg-secondary p-2 rounded">
                    <span className="text-lg">{index + 1}. {item.content}</span>
                    <div className="space-x-2">
                      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white p-4 rounded-lg shadow-lg text-black">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Editar punto de agenda</DialogTitle>
                          </DialogHeader>
                          <Input
                            value={editItem?.content || ''}
                            onChange={(e) => setEditItem(editItem ? { ...editItem, content: e.target.value } : null)}
                            className="border border-gray-300 rounded-md p-2"
                          />
                          <DialogFooter>
                            <Button
                              onClick={() => handleEditItem(item.id)}
                              className="mt-2 bg-blue-500 text-white"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 transition duration-200">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-100 p-6 rounded-lg shadow-lg text-black">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-bold">¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-700">
                              Esta acción no se puede deshacer. Esto eliminará permanentemente este punto de agenda.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-gray-500 hover:text-gray-700">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-red-600 text-white hover:bg-red-700 transition duration-200">
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <div>No hay puntos de agenda disponibles.</div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AgendaAssemblySection;
