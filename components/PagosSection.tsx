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

interface Member {
  id: string;
  name: string;
}

interface Loan {
  id: string;
  name: string;
}

interface LoanPayment {
  id: number;
  request_date: string; // Updated field
  amount: string; // Updated field
  monthly_interest: string; // Updated field
  number_of_installments: number; // Updated field
  approved: boolean; // Updated field
  rejected: boolean; // Updated field
  rejection_reason: string; // Updated field
  paid: boolean; // Updated field
  remaining_amount: string; // Updated field
  remaining_installments: number; // Updated field
  member: number; // Updated field
  junta: number; // Updated field
  member_name: string; // Updated field
  cuota: number; // Updated field
  fecha_pago: string; // Updated field
}


const formSchema = z.object({
  date: z.date(),
  member: z.string().min(1, { message: "Please select a member" }),
  loan: z.string().min(1, { message: "Please select a loan" }),
});

export default function PagosSection({juntaId} : {juntaId: string}) {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [prestamos, setPrestamos] = useState<LoanPayment[]>([]);
  const [history, setHistory] = useState<LoanPayment[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null); // New state for selected member
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      member: "",
      loan: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await handleGetMembers();
      await fetchPrestamos();
      await fetchHistory();
      setIsLoading(false);
    };
    fetchData();
  }, [juntaId]);

  const handleGetMembers = async () => {
    const response = await fetch(`/api/members/${juntaId}`);
    if (response.ok) {
      const data = await response.json();
      setMembers(data);
    }
  };

  const fetchPrestamos = async (): Promise<void> => {
    try {
      const response = await fetch('/api/prestamos');
      if (!response.ok) throw new Error('Failed to fetch prestamos');
      const data: LoanPayment[] = await response.json();
      setPrestamos(data);
    } catch (error) {
      console.error('Error fetching prestamos:', error);
    }
  };

  const fetchHistory = async () => {
    const response = await fetch(`/api/juntas/${juntaId}/pagos`);
    if (response.ok) {
      const data = await response.json();
      setHistory(data);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!prestamos.some(prestamo => prestamo.member === Number(selectedMember))) {
      toast({
        title: "Error",
        description: "No hay prestamos disponibles para el miembro seleccionado.",
        variant: "destructive",
      });
      return; // Prevent submission if no loans are available
    }

    const response = await fetch(`/api/juntas/${juntaId}/pagos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      await fetchHistory();
      form.reset();
      toast({
        title: "Pago realizado",
        description: "El pago del préstamo se ha registrado exitosamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el pago del préstamo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pago a Cuenta de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Pago</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"
                                }`}
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
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMember(value); // Update selected member state
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar miembro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members.map((member) => (
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
                  name="loan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Préstamo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMember}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar préstamo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {prestamos.filter(prestamo => prestamo.member === Number(selectedMember)).length > 0 ? (
                            prestamos
                              .filter(prestamo => prestamo.member === Number(selectedMember))
                              .map((prestamo) => (
                                <SelectItem key={prestamo.id} value={prestamo.id.toString()}>{prestamo.amount} soles - {prestamo.member_name} - {prestamo.request_date}</SelectItem>
                              ))
                          ) : (
                            <SelectItem value='No hay prestamos' disabled>No hay prestamos</SelectItem> // Display message if no loans
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Realizar Pago</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Préstamo</TableHead>
                  <TableHead>Monto Cuota</TableHead>
                  <TableHead>Monto Interés</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.fecha_pago), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>S/{item.cuota}</TableCell>
                    <TableCell>S/{item.monthly_interest}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div>No payment history available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}