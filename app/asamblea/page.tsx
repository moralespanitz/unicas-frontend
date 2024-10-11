'use client'
import React, { useState } from 'react'
import AssemblySection from '@/components/multistep-assembly/AssemblySection'
import AttendanceAssemblySection from '@/components/multistep-assembly/AttendanceAssemblyComponent'
import AgendaAssemblySection from '@/components/multistep-assembly/AgendaAssemblySection'
import ActaPrevia from '@/components/multistep-assembly/AgendaItems/ActaPrevia'
import CompraDeAcciones from '@/components/multistep-assembly/AgendaItems/CompraDeAcciones'
import PagoDePrestamos from '@/components/multistep-assembly/AgendaItems/PagoDePrestamos'
import SolicitudesDePrestamos from '@/components/multistep-assembly/AgendaItems/SolicitudesDePrestamos'
import RegistroDePrestamos from '@/components/multistep-assembly/AgendaItems/RegistroDePrestamos'
import CierreDeActa from '@/components/multistep-assembly/AgendaItems/CierreDeActa'

interface Socio {
  id: number;
  name: string;
}

interface AttendanceRecord {
  [key: string]: string;
}

interface AttendanceData {
  [key: number]: AttendanceRecord;
}

const AssemblyPage: React.FC = () => {
  // Mock data for socios and assembly dates
  const socios: Socio[] = [
    { id: 1, name: "Brooklyn Simmons" },
    { id: 2, name: "Leslie Alexander" },
    { id: 3, name: "Dianne Russell" },
    { id: 4, name: "Jenny Wilson" },
    { id: 5, name: "Guy Hawkins" },
  ]
  const assemblyDates = ["10/01", "10/02", "10/03", "10/04", "10/05", "10/06", "10/07", "10/08", "10/09", "10/10", "10/11"]

  // Mock data for past sessions
  const [attendance, setAttendance] = useState<AttendanceData>({
    1: {
      "10/01": "Asistio", "10/02": "Asistio", "10/03": "Asistio", "10/04": "Asistio",
      "10/05": "Asistio", "10/06": "Asistio", "10/07": "Asistio", "10/08": "Asistio",
      "10/09": "Asistio", "10/10": "Asistio"
    },
    2: {
      "10/01": "Falta", "10/02": "Asistio", "10/03": "Asistio", "10/04": "Asistio",
      "10/05": "Asistio", "10/06": "Asistio", "10/07": "Asistio", "10/08": "Asistio",
      "10/09": "Asistio", "10/10": "Asistio"
    },
    3: {
      "10/01": "Asistio", "10/02": "Asistio", "10/03": "Asistio", "10/04": "Asistio",
      "10/05": "Falta", "10/06": "Asistio", "10/07": "Asistio", "10/08": "Asistio",
      "10/09": "Asistio", "10/10": "Asistio"
    },
    4: {
      "10/01": "Asistio", "10/02": "Asistio", "10/03": "Tardanza", "10/04": "Asistio",
      "10/05": "Asistio", "10/06": "Asistio", "10/07": "Asistio", "10/08": "Asistio",
      "10/09": "Asistio", "10/10": "Asistio"
    },
    5: {
      "10/01": "Asistio", "10/02": "Asistio", "10/03": "Asistio", "10/04": "Asistio",
      "10/05": "Asistio", "10/06": "Asistio", "10/07": "Asistio", "10/08": "Asistio",
      "10/09": "Asistio", "10/10": "Asistio"
    }
  })

  const handleAttendanceChange = async (socioId: number, date: string, status: string) => {
    try {
      // Call the API to update the attendance
      // await updateAttendance(date, socioId, status);
      
      // Update the local state
      setAttendance(prev => ({
        ...prev,
        [socioId]: { ...prev[socioId], [date]: status }
      }))
    } catch (error) {
      console.error('Failed to update attendance:', error);
      // Optionally, show an error message to the user
    }
  }

  const steps = [
    {
      title: "Asistencia",
      content: (
        <AttendanceAssemblySection
          socios={socios}
          assemblyDates={assemblyDates}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      )
    },
    { title: "Agenda", content: <AgendaAssemblySection /> },
    { title: "Acta previa", content: <ActaPrevia /> },
    { title: "Compra de acciones", content: <CompraDeAcciones /> },
    { title: "Pago de prestamos", content: <PagoDePrestamos /> },
    { title: "Solicitudes de prestamos", content: <SolicitudesDePrestamos /> },
    { title: "Registro de prestamos", content: <RegistroDePrestamos /> },
    { title: "Cierre de Acta", content: <CierreDeActa /> }
  ]

  return <AssemblySection steps={steps} />
}

export default AssemblyPage