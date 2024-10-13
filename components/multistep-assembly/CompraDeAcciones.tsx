import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AccionPurchase {
  id: number;
  member: string;
  date: string;
  quantity: number;
  value: number;
  member_name: string;
}

const formSchema = z.object({
  date: z.date(),
  member: z.string().min(1, { message: "Por favor seleccione un miembro" }),
  quantity: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
  value: z.number().min(0, { message: "El valor debe ser mayor o igual a 0" }),
});

interface CompraDeAccionesProps {
  juntaId: string;
  compraAcciones: AccionPurchase[];
  onCompraAccionesChange: (compraAcciones: AccionPurchase[]) => void;
}

const CompraDeAcciones: React.FC<CompraDeAccionesProps> = ({ juntaId, compraAcciones, onCompraAccionesChange }) => {
  const [history, setHistory] = useState<AccionPurchase[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      member: "",
      quantity: 0,
      value: 0,
    },
  });

  useEffect(() => {
      fetchHistory();
  }, [juntaId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/members/${juntaId}`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/juntas/${juntaId}/acciones`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        onCompraAccionesChange(data);
      }
    } catch (error) {
      console.error('Error fetching acciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const jsonBody = {
        member: values.member,
        date: values.date,
        quantity: values.quantity,
        value: values.value,
        junta: juntaId
      };
      const response = await fetch(`/api/juntas/${juntaId}/acciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonBody)
      });
      if (response.ok) {
        const newPurchase = await response.json();
        onCompraAccionesChange([...compraAcciones, newPurchase]);
        form.reset();
        toast({
          title: "Éxito",
          description: "Compra de acciones registrada correctamente",
        });
      } else {
        console.error('Error adding accion:', response);
        toast({
          title: "Error",
          description: "No se pudo registrar la compra de acciones",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding accion:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la compra de acciones",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccion = async (accionId: number) => {
    try {
      const response = await fetch(`/api/juntas/${juntaId}/acciones`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accionId })
      });
      if (response.ok) {
        const updatedCompraAcciones = compraAcciones.filter(item => item.id !== accionId);
        onCompraAccionesChange(updatedCompraAcciones);
        toast({
          title: "Éxito",
          description: "Compra de acciones eliminada correctamente",
        });
      } else {
        console.error('Error deleting accion:', response);
        toast({
          title: "Error",
          description: "No se pudo eliminar la compra de acciones",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting accion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la compra de acciones",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Compra de Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Compra</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="member"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miembro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar miembro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.length > 0 ? members.map(member => (
                          <SelectItem key={member.id} value={member.id.toString()}>{member.full_name}</SelectItem>
                        )) : (
                          <SelectItem value='No hay miembros' disabled>No hay miembros</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Acciones</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por Acción</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Procesar Compra</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Compra de Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cantidad de Acciones</TableHead>
                  <TableHead>Valor en Soles</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.member_name}</TableCell>
                    <TableCell>{format(new Date(item.date), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>S/{item.value}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDeleteAccion(item.id)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div>No hay historial de compra de acciones disponible.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompraDeAcciones;
