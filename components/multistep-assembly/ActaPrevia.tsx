import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from 'react';

interface SocioData {
  nombre: string;
  asistencia: string;
  accionesCompradas: number;
  valorAcciones: number;
  pagoCapital: number;
  pagoIntereses: number;
  pagoCuota: number;
}

// Mock API function to fetch last acta data
const fetchLastActa = async (): Promise<SocioData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { nombre: "Alicia Heras Chilon", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Maria Agustina Mosqueira", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Margarita Novoa Chilon", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Lucy Novoa Chilon", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Elsa Heras Chilón", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Maria Elizabeth Chilon Tanta", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Maria Isabel Herrera", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Flora Chilon Silva", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Edeli Heras Chilón", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Maria Santos Chilón Silva", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Celinda Tucto Llovera", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Alicia Perez Terrones", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Horfelinda Herrera Infante", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
    { nombre: "Celinda Novoa Chilón", asistencia: "A", accionesCompradas: 6, valorAcciones: 60, pagoCapital: 0, pagoIntereses: 0, pagoCuota: 0 },
  ];
};

interface ActaPreviaProps {
  juntaId: string;
  actaPrevia: SocioData[];
  onActaPreviaChange: (actaPrevia: SocioData[]) => void;
}

const ActaPrevia: React.FC<ActaPreviaProps> = ({ juntaId, actaPrevia, onActaPreviaChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actaPrevia.length === 0) {
      loadLastActa();
    }
  }, [juntaId, actaPrevia]);

  const loadLastActa = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLastActa();
      onActaPreviaChange(data);
    } catch (error) {
      console.error('Error fetching last acta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acta Previa - Asistencia AS Del día: 19/02</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Cargando acta previa...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socios</TableHead>
                  <TableHead>Asistencia</TableHead>
                  <TableHead>Acciones compradas</TableHead>
                  <TableHead>Valor en acciones</TableHead>
                  <TableHead>Pago de capital</TableHead>
                  <TableHead>Pago de intereses</TableHead>
                  <TableHead>Pago de cuota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actaPrevia.map((socio, index) => (
                  <TableRow key={index}>
                    <TableCell>{socio.nombre}</TableCell>
                    <TableCell>{socio.asistencia}</TableCell>
                    <TableCell>{socio.accionesCompradas}</TableCell>
                    <TableCell>{socio.valorAcciones}</TableCell>
                    <TableCell>{socio.pagoCapital}</TableCell>
                    <TableCell>{socio.pagoIntereses}</TableCell>
                    <TableCell>{socio.pagoCuota}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActaPrevia;
