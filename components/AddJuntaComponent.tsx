import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface AddJuntaComponentProps {
  onJuntaAdded: () => void;
}

export const AddJuntaComponent: React.FC<AddJuntaComponentProps> = ({ onJuntaAdded }) => {
  const [newJuntaName, setNewJuntaName] = useState<string>('');
  const [showNewJuntaDialog, setShowNewJuntaDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateNewJunta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newJuntaName.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/juntas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newJuntaName }),
      });
      if (!response.ok) {
        throw new Error('Failed to create junta');
      }
      const data = await response.json();
      console.log(data);
      setNewJuntaName('');
      setShowNewJuntaDialog(false);
      onJuntaAdded();
    } catch (error) {
      console.error('Error creating junta:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md w-min mb-10">
      <Button 
        onClick={() => setShowNewJuntaDialog(true)}
        className="w-min bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        <PlusCircle className="mr-2 h-6 w-6" />
        Crear nueva junta
      </Button>
      <Dialog open={showNewJuntaDialog} onOpenChange={setShowNewJuntaDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800">Crear Nueva UNICA</DialogTitle>
            <DialogDescription className="text-gray-600">
              Ingrese el nombre de la nueva UNICA. Haga clic en crear cuando esté listo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNewJunta} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre
              </Label>
              <Input
                id="name"
                value={newJuntaName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJuntaName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese el nombre aquí"
                required
              />
            </div>
            <DialogFooter className="space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewJuntaDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creando...' : 'Crear UNICA'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};