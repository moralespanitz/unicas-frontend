import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { useEffect } from 'react'; // Added useEffect for fetching members

interface AccionPurchase {
  id: number;
  member: string;
  date: string;
  quantity: number;
  value: number;
}

const formSchema = z.object({
  member: z.string().min(1, { message: "Add correct value" }),
  date: z.date(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  value: z.number().min(0, { message: "Value must be non-negative" }),
});

export default function AcccionesSection({juntaId} : {juntaId: string}) {
  const [history, setHistory] = React.useState<AccionPurchase[]>([]);
  const [members, setMembers] = React.useState<any[]>([]); // Added state for members
  const [loading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member: "",
      date: new Date(),
      quantity: 0,
      value: 0,
    },
  });

  React.useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => { // Added useEffect to fetch members
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/members/${juntaId}`); // Fetch members from backend
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    setIsLoading(true);
    fetchMembers();
    setIsLoading(false);
  }, []);

  const fetchHistory = async () => {
    const response = await fetch(`/api/juntas/${juntaId}/acciones`);
    if (response.ok) {
      const data = await response.json();
      setHistory(data);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch(`/api/juntas/${juntaId}/acciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, junta: juntaId }),
    });

    if (response.ok) {
      await fetchHistory();
      form.reset();
      toast({
        title: "Acciones compradas",
        description: "La compra de acciones se ha registrado exitosamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar la compra de acciones.",
        variant: "destructive",
      });
    }
  };
  if (loading) {
    return <h1>Loading...</h1>
  }
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Comprar Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="member"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miembro</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar miembro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map(member => (
                          <SelectItem key={member.id} value={member.id.toString()}>{member.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Movimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                    <FormLabel>Valor en Soles</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Comprar Acciones</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Compra de Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cantidad de Acciones</TableHead>
                <TableHead>Valor en Soles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.member}</TableCell>
                  <TableCell>{format(new Date(item.date), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>S/{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}