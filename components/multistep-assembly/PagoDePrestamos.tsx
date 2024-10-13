import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Checkbox } from '@/components/ui/checkbox';

interface Member {
  id: string;
  full_name: string;
}

interface LoanPayment {
  id: number;
  amount: string;
  monthly_interest: string;
  member: number;
  member_name: string;
  cuota: number;
  loan_type: string;
  monthly_payment: number | null;
}

interface PagoDePrestamosProps {
  juntaId: string;
  pagoPrestamos: LoanPayment[];
  onPagoPrestamosChange: (pagoPrestamos: LoanPayment[]) => void;
}

const formSchema = z.object({
  member: z.string().min(1, { message: "Please select a member" }),
  loan: z.string().min(1, { message: "Please select a loan" }),
  monthly_payment: z.number().min(0, { message: "Please enter a valid monthly payment" }),
  custom_amount: z.number().min(0, { message: "Please enter a valid custom amount" }),
});

const PagoDePrestamos: React.FC<PagoDePrestamosProps> = ({ juntaId, pagoPrestamos, onPagoPrestamosChange }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [prestamos, setPrestamos] = useState<LoanPayment[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanPayment | null>(null);
  const [showDifferentPayment, setShowDifferentPayment] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member: "",
      loan: "",
      monthly_payment: 0,
      custom_amount: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await handleGetMembers();
      await fetchPrestamos();
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
      const response = await fetch(`/api/prestamos/${juntaId}`);
      if (!response.ok) throw new Error('Failed to fetch prestamos');
      const data = await response.json();
      setPrestamos(data);
    } catch (error) {
      console.error('Error fetching prestamos:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!prestamos.some(prestamo => prestamo.member === Number(selectedMember))) {
      toast({
        title: "Error",
        description: "No hay prestamos disponibles para el miembro seleccionado.",
        variant: "destructive",
      });
      return;
    }

    const selectedPrestamo = prestamos.find(prestamo => prestamo.id === Number(values.loan));
    if (!selectedPrestamo) {
      toast({
        title: "Error",
        description: "No se encontró el préstamo seleccionado.",
        variant: "destructive",
      });
      return;
    }

    let paymentAmount = selectedPrestamo.cuota;

    if (selectedPrestamo.loan_type === 'Cuota variable') {
      const customAmount = prompt('Ingrese el monto de pago para este préstamo de cuota variable:');
      if (customAmount !== null) {
        paymentAmount = parseFloat(customAmount);
      } else {
        toast({
          title: "Error",
          description: "Debe ingresar un monto de pago para los préstamos de cuota variable.",
          variant: "destructive",
        });
        return;
      }
    }

    const response = await fetch(`/api/juntas/${juntaId}/pagos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        paymentAmount: paymentAmount,
      }),
    });
    if (response.ok) {
      form.reset();
      toast({
        title: "Pago realizado",
        description: "El pago del préstamo se ha registrado exitosamente.",
      });
      const newPayment = await response.json();
      onPagoPrestamosChange([...pagoPrestamos, newPayment]);
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el pago del préstamo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pago de Préstamos</CardTitle>
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedMember(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar miembro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                      members.length > 0 && members.map((member) => (
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const loan = prestamos.find(p => p.id.toString() === value);
                      setSelectedLoan(loan || null);
                      if (loan) {
                        form.setValue("monthly_payment", loan.monthly_payment || 0);
                      }
                    }}
                    defaultValue={field.value}
                    disabled={!selectedMember}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar préstamo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prestamos
                        .filter(prestamo => prestamo.member === Number(selectedMember))
                        .map((prestamo) => (
                          <SelectItem key={prestamo.id} value={prestamo.id.toString()}>
                            {prestamo.amount} soles - {prestamo.member_name} - {prestamo.loan_type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedLoan && (
              <div>
                {selectedLoan.monthly_payment == null && 
                <FormField
                  control={form.control}
                  name="monthly_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto de pago diferente</FormLabel>
                      <Input 
                        type="number"
                        {...field}
                        placeholder="Ingrese el monto de pago"
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                }
                {selectedLoan.monthly_payment != null && <p><span className='text-sm font-semibold'>Cuota mensual:</span> S/{selectedLoan.monthly_payment.toFixed(2)}</p>}
              </div>
            )}

            {selectedLoan?.monthly_payment != null && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="registrarCuotaDiferente" 
                    checked={showDifferentPayment}
                    onCheckedChange={(checked) => setShowDifferentPayment(checked as boolean)}
                  />
                  <Label htmlFor="registrarCuotaDiferente">
                    Registrar cuota diferente
                  </Label>
                </div>
                {showDifferentPayment && (
                  <FormField
                    control={form.control}
                    name="custom_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto de pago diferente</FormLabel>
                        <Input 
                          type="number" 
                          {...field} 
                          placeholder="Ingrese el monto de pago"
                          value={field.value || ''}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
            <Button type="submit">Procesar Pago</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PagoDePrestamos;
