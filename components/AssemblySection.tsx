import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Member {
  id: number;
  full_name: string;
}

interface Assembly {
  id: number;
  date: string;
  attendees: { memberId: number; present: boolean }[];
  agenda: string[];
  previousMinutesApproved: boolean;
  finesPaid: { memberId: number; amount: number }[];
  sharesPurchased: { memberId: number; amount: number }[];
  loanPayments: { memberId: number; amount: number }[];
  newLoans: { memberId: number; amount: number }[];
  decisions: string[];
}

export default function AsambleaSection({juntaId} : {juntaId: string}) {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newAssembly, setNewAssembly] = useState<Omit<Assembly, 'id'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    attendees: [],
    agenda: [''],
    previousMinutesApproved: false,
    finesPaid: [],
    sharesPurchased: [],
    loanPayments: [],
    newLoans: [],
    decisions: [''],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAssemblies();
    fetchMembers();
  }, []);

  const fetchAssemblies = async () => {
    try {
      const response = await fetch('/api/assemblies');
      if (response.ok) {
        const data = await response.json();
        setAssemblies(data);
      } else {
        throw new Error('Failed to fetch assemblies');
      }
    } catch (error) {
      console.error('Error fetching assemblies:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las asambleas.",
        variant: "destructive",
      });
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members/1');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
        setNewAssembly(prev => ({
          ...prev,
          attendees: data.map((member: Member) => ({ memberId: member.id, present: false })),
        }));
      } else {
        throw new Error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssembly(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendanceChange = (memberId: number, present: boolean) => {
    setNewAssembly(prev => ({
      ...prev,
      attendees: prev.attendees.map(a => 
        a.memberId === memberId ? { ...a, present } : a
      ),
    }));
  };

  const handleAgendaChange = (index: number, value: string) => {
    setNewAssembly(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item),
    }));
  };

  const handleDecisionChange = (index: number, value: string) => {
    setNewAssembly(prev => ({
      ...prev,
      decisions: prev.decisions.map((item, i) => i === index ? value : item),
    }));
  };

  const handleFinePaid = (memberId: number, amount: number) => {
    setNewAssembly(prev => ({
      ...prev,
      finesPaid: [...prev.finesPaid, { memberId, amount }],
    }));
  };

  const handleSharesPurchased = (memberId: number, amount: number) => {
    setNewAssembly(prev => ({
      ...prev,
      sharesPurchased: [...prev.sharesPurchased, { memberId, amount }],
    }));
  };

  const handleLoanPayment = (memberId: number, amount: number) => {
    setNewAssembly(prev => ({
      ...prev,
      loanPayments: [...prev.loanPayments, { memberId, amount }],
    }));
  };

  const handleNewLoan = (memberId: number, amount: number) => {
    setNewAssembly(prev => ({
      ...prev,
      newLoans: [...prev.newLoans, { memberId, amount }],
    }));
  };

  const handleSubmitNewAssembly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assemblies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssembly),
      });
      if (response.ok) {
        await fetchAssemblies();
        toast({
          title: "Asamblea creada",
          description: "Se ha creado una nueva asamblea exitosamente.",
        });
        // Reset the form
        setNewAssembly({
          date: format(new Date(), 'yyyy-MM-dd'),
          attendees: members.map(member => ({ memberId: member.id, present: false })),
          agenda: [''],
          previousMinutesApproved: false,
          finesPaid: [],
          sharesPurchased: [],
          loanPayments: [],
          newLoans: [],
          decisions: [''],
        });
      } else {
        throw new Error('Failed to create assembly');
      }
    } catch (error) {
      console.error('Error creating assembly:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear la asamblea.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nueva Asamblea</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitNewAssembly} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">Fecha</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newAssembly.date}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="previousMinutesApproved" className="text-sm font-medium">Acta Anterior Aprobada</Label>
                <div className="flex items-center mt-1">
                  <Checkbox
                    id="previousMinutesApproved"
                    checked={newAssembly.previousMinutesApproved}
                    onCheckedChange={(checked) => setNewAssembly(prev => ({ ...prev, previousMinutesApproved: checked as boolean }))}
                  />
                  <Label htmlFor="previousMinutesApproved" className="ml-2">Sí</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Toma de Asistencia</Label>
              <ScrollArea className="h-[200px] mt-1 border rounded-md p-4">
                {members.map(member => (
                  <div key={member.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`attendance-${member.id}`}
                      checked={newAssembly.attendees.find(a => a.memberId === member.id)?.present}
                      onCheckedChange={(checked) => handleAttendanceChange(member.id, checked as boolean)}
                    />
                    <Label htmlFor={`attendance-${member.id}`} className="text-sm">{member.full_name}</Label>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                {newAssembly.agenda.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                    placeholder={`Punto de agenda ${index + 1}`}
                    className="mt-1 mb-2"
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setNewAssembly(prev => ({ ...prev, agenda: [...prev.agenda, ''] }))}>
                  Agregar punto de agenda
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pagos de Multas</CardTitle>
              </CardHeader>
              <CardContent>
                {members.map(member => (
                  <div key={member.id} className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Monto"
                      onChange={(e) => handleFinePaid(member.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <Label className="text-sm">{member.full_name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Compra de Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                {members.map(member => (
                  <div key={member.id} className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Monto"
                      onChange={(e) => handleSharesPurchased(member.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <Label className="text-sm">{member.full_name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pagos de Préstamos</CardTitle>
              </CardHeader>
              <CardContent>
                {members.map(member => (
                  <div key={member.id} className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Monto"
                      onChange={(e) => handleLoanPayment(member.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <Label className="text-sm">{member.full_name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Nuevos Préstamos</CardTitle>
              </CardHeader>
              <CardContent>
                {members.map(member => (
                  <div key={member.id} className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Monto"
                      onChange={(e) => handleNewLoan(member.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <Label className="text-sm">{member.full_name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div>
              <Label className="text-sm font-medium">Decisiones</Label>
              {newAssembly.decisions.map((decision, index) => (
                <Textarea
                  key={index}
                  value={decision}
                  onChange={(e) => handleDecisionChange(index, e.target.value)}
                  placeholder={`Decisión ${index + 1}`}
                  className="mt-1 mb-2"
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setNewAssembly(prev => ({ ...prev, decisions: [...prev.decisions, ''] }))}>
                Agregar decisión
              </Button>
            </div>

            <Button type="submit" className="w-full">Crear Asamblea</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Historial de Actas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assemblies.map((assembly) => (
                <TableRow key={assembly.id}>
                  <TableCell>{format(new Date(assembly.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{assembly.attendees.filter(a => a.present).length} de {assembly.attendees.length}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Ver Detalles</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">Detalles de la Asamblea</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fecha:</Label>
                            <div className="col-span-3">{format(new Date(assembly.date), 'dd/MM/yyyy')}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Asistentes:</Label>
                            <div className="col-span-3">{assembly.attendees.filter(a => a.present).length} de {assembly.attendees.length}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Agenda:</Label>
                            <div className="col-span-3">{assembly.agenda.join(', ')}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Acta anterior:</Label>
                            <div className="col-span-3">{assembly.previousMinutesApproved ? 'Aprobada' : 'No aprobada'}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Multas pagadas:</Label>
                            <div className="col-span-3">{assembly.finesPaid.length}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Acciones compradas:</Label>
                            <div className="col-span-3">{assembly.sharesPurchased.length}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Pagos de préstamos:</Label>
                            <div className="col-span-3">{assembly.loanPayments.length}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Nuevos préstamos:</Label>
                            <div className="col-span-3">{assembly.newLoans.length}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Decisiones:</Label>
                            <div className="col-span-3">{assembly.decisions.join(', ')}</div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}