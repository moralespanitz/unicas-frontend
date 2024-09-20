import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

interface AddJuntaComponentProps {
  onJuntaAdded: () => void;
}

const formSchema = z.object({
  fecha_inicio: z.date(),
  name: z.string().min(1, "El nombre es requerido"),
});

export const AddJuntaComponent = ({ onJuntaAdded }: AddJuntaComponentProps) => {
  const [showNewJuntaDialog, setShowNewJuntaDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha_inicio: new Date(),
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formattedDate = format(values.fecha_inicio, "yyyy-MM-dd");
      const response = await fetch('/api/juntas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          fecha_inicio: formattedDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create junta');
      }

      const data = await response.json();
      console.log(data);
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
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl text-black">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800">Crear Nueva UNICA</DialogTitle>
            <DialogDescription className="text-gray-600">
              Ingrese el nombre de la nueva UNICA. Haga clic en crear cuando esté listo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese el nombre aquí" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Creación</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                            {field.value ? format(field.value, "PPP") : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewJuntaDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Creando...' : 'Crear UNICA'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};