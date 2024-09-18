import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from 'react'; // Added useEffect

export default function MultaSection({ juntaId }: { juntaId: string }) {
  const [member, setMember] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [multas, setMultas] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]); // Added state for members

  useEffect(() => { // Added useEffect to fetch members
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/members/${juntaId}`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    const fetchMultas = async () => {
      try {
        const response = await fetch(`/api/juntas/${juntaId}/multas`);
        if (!response.ok) throw new Error('Failed to fetch multas');
        const data = await response.json();
        setMultas(data);
      } catch (error) {
        console.error('Error fetching multas:', error);
      }
    };
    setIsLoading(true);
    fetchMembers();
    fetchMultas();
    setIsLoading(false);
  }, []);

  const handlePayMulta = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    const response = await fetch(`/api/juntas/${juntaId}/multas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: description, amount: amount, member: member }), // Updated fields
    });

    if (response.ok) {
      const newMulta = await response.json();
      setMultas([...multas, newMulta]);
      setMember('');
      setDescription('');
      setAmount('');
    }
  };
  if (isLoading) {
    return <h1>Loading...</h1>
  }
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pagar Multa</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePayMulta}> {/* Added onSubmit */}
            <Select onValueChange={setMember} value={member}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar miembro" />
              </SelectTrigger>
              <SelectContent>
                {members.length > 0 ? ( // Updated to display fetched members
                  members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.full_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="No members" disabled>No hay miembros disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Input
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={handlePayMulta}>Pagar Multa</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Multas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multas.map((multa, index) => (
                <TableRow key={index}>
                  <TableCell>{multa.member}</TableCell> {/* Assuming member is static for display */}
                  <TableCell>{multa.reason}</TableCell> {/* Updated field */}
                  <TableCell>{multa.amount}</TableCell>
                  <TableCell>{multa.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}