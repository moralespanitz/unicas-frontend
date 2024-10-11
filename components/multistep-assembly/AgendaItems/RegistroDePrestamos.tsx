import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const RegistroDePrestamos: React.FC = () => {
  // Mock data for prestamos
  const prestamos = [
    { id: 1, socio: 'Socio 1', monto: 1000, fecha: '2023-01-15', estado: 'Activo' },
    { id: 2, socio: 'Socio 2', monto: 2000, fecha: '2023-02-20', estado: 'Pagado' },
    { id: 3, socio: 'Socio 3', monto: 1500, fecha: '2023-03-10', estado: 'Activo' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Préstamos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Socio</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestamos.map((prestamo) => (
              <TableRow key={prestamo.id}>
                <TableCell>{prestamo.id}</TableCell>
                <TableCell>{prestamo.socio}</TableCell>
                <TableCell>${prestamo.monto}</TableCell>
                <TableCell>{prestamo.fecha}</TableCell>
                <TableCell>{prestamo.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RegistroDePrestamos;