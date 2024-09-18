'use client';

import { AddJuntaComponent } from "@/components/AddJuntaComponent";
import { JuntaCard } from "@/components/JuntaCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Junta } from "@/types/junta";
import { Protect } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";


const Home: React.FC = () => {
  const [juntas, setJuntas] = useState<Junta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteJuntaId, setDeleteJuntaId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    handleGetJuntas();
  }, []);

  const handleGetJuntas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/juntas');
      if (!response.ok) {
        throw new Error('Failed to fetch juntas');
      }
      const data = await response.json();
      setJuntas(data);
    } catch (error) {
      console.error("Failed to fetch juntas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJunta = (junta: Junta) => {
    router.push(`/juntas/${junta.id}`);
  };

  const handleDeleteJunta = async (juntaId: string) => {
    try {
      const response = await fetch(`/api/juntas/${juntaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete junta');
      }
      setJuntas(juntas.filter(j => j.id.toString() !== juntaId));
    } catch (error) {
      console.error("Failed to delete junta:", error);
    } finally {
      setDeleteJuntaId(null);
    }
  };

  return (
    <Protect>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Juntas Management</h1>
          <AddJuntaComponent onJuntaAdded={handleGetJuntas} />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : juntas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {juntas.map((junta) => (
                <JuntaCard
                  key={junta.id}
                  junta={junta}
                  onSelectJunta={() => handleSelectJunta(junta)}
                  onDeleteJunta={() => setDeleteJuntaId(junta.id.toString())}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-md">
              <CardContent className="p-6">
                <p className="text-xl text-center text-gray-600">No juntas found. Add one to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>

        <AlertDialog open={!!deleteJuntaId} onOpenChange={(open) => !open && setDeleteJuntaId(null)}>
          <AlertDialogContent className="bg-white rounded-lg shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-800">Delete Junta</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the junta and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteJuntaId && handleDeleteJunta(deleteJuntaId)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Protect>
  );
};


export default Home;