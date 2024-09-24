import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from 'react'
import { format } from "date-fns";

const ResumenSection = ({ juntaId } : { juntaId: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [multas, setMultas] = useState<any[]>([]);
  const [acciones, setAcciones] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [capital, setCapital] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersResponse = await fetch(`/api/members/${juntaId}`);
        const membersData = await membersResponse.json();
        setMembers(membersData);

        const loansResponse = await fetch(`/api/prestamos/${juntaId}`);
        const loansData = await loansResponse.json();
        setLoans(loansData);

        const multasResponse = await fetch(`/api/juntas/${juntaId}/multas`);
        const multasData = await multasResponse.json();
        setMultas(multasData);

        const accionesResponse = await fetch(`/api/juntas/${juntaId}/acciones`);
        const accionesData = await accionesResponse.json();
        setAcciones(accionesData);

        const pagosResponse = await fetch(`/api/juntas/${juntaId}/pagos`);
        const pagosData = await pagosResponse.json();
        setPagos(pagosData);

        const capitalResponse = await fetch(`/api/juntas/${juntaId}/capital`);
        const capitalData = await capitalResponse.json();

        setCapital(capitalData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [juntaId]);

  return (
    <div className="space-y-8" key={JSON.stringify(members)}>
      <h2 className="text-2xl font-bold mb-4">Resumen de Junta</h2>
      <div>
        <h3 className="text-xl font-semibold">Lista de Socios</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length > 0 ? (
              members.map((member: any) => (
                <TableRow key={member.id}>
                  <TableCell>{member.full_name}</TableCell>
                  <TableCell>{member.document_type}: {member.document_number}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>Not members</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Préstamos Activos</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Monto Original</TableHead>
              <TableHead>Monto Adeudado</TableHead>
              <TableHead>Cuotas Pendientes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length > 0 ? (
              loans.map((loan: any) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.member_name}</TableCell>
                  <TableCell>S/.{loan.amount}</TableCell>
                  <TableCell>S/.{loan.remaining_amount}</TableCell>
                  <TableCell>{loan.remaining_installments}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Not loans</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Historial de Multas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {multas.length > 0 ? (
              multas.map((multa: any) => (
                <TableRow key={multa.id}>
                  <TableCell>{multa.member_name}</TableCell>
                  <TableCell>{multa.reason}</TableCell>
                  <TableCell>S/.{multa.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Not multas</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Acciones Compradas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acciones.length > 0 ? (
              acciones.map((accion: any) => (
                <TableRow key={accion.id}>
                  <TableCell>{accion.member_name}</TableCell>
                  <TableCell>{accion.quantity}</TableCell>
                  <TableCell>S/.{accion.value}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Not acciones</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Historial de Pagos</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagos.length > 0 ? (
              pagos.map((pago: any) => (
                <TableRow key={pago.id}>
                  <TableCell>{pago.member_name}</TableCell>
                  <TableCell>S/.{pago.amount}</TableCell>
                  <TableCell>{format(new Date(pago.fecha_pago), "yyyy-MM-dd")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Not pagos</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Capital Social</h3>
        {capital ? (
          <>
            <p>Reserva Legal: S/{capital.reserva_legal}</p>
            <p>Fondo Social: S/{capital.fondo_social}</p>
          </>
        ) : (
          <p>No capital data available</p>
        )}
      </div>
    </div>
  )
}

export default ResumenSection