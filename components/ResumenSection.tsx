import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

const ResumenSection = ({juntaId} : {juntaId: string}) => {
  const [members, setMembers] = useState([])
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true) // {{ edit_1 }}

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true) // {{ edit_2 }}
      try {
        const membersResponse = await fetch(`/api/members/${juntaId}`)
        const membersData = await membersResponse.json()
        setMembers(membersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false) // {{ edit_3 }}
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {isLoading ? ( // {{ edit_4 }}
        <p>Cargando...</p>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-4">Lista de Miembros</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.document_type}: {member.document_number}</TableCell>
                    <TableCell>{member.shares}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Préstamos Activos</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Monto Original</TableHead>
                  <TableHead>Monto Adeudado</TableHead>
                  <TableHead>Cuotas Pendientes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan: any) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.member}</TableCell>
                    <TableCell>S/.{loan.amount}</TableCell>
                    <TableCell>S/.{loan.amount}</TableCell>
                    <TableCell>{loan.number_of_installments}</TableCell>
                    <TableCell>{loan.approved ? "Aprobado" : "No aprobado"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <div>
            <h2 className="text-2xl font-bold mb-4">Tabla General de Miembros</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Valor en Soles</TableHead>
                  <TableHead>Multas Pagadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generalTable.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.actions}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{item.finesPaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div> */}
        </>
      )}
    </div>
  )
}

export default ResumenSection