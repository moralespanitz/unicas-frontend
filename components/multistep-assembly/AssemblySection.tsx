'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Check, Clock, X } from "lucide-react"
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import PagosSection from "../PagosSection"
import PrestamosSection from "../PrestamosSection"
import AccionesSection from "../AccionesSection"
import AgendaSection from "../AgendaSection"

const AssemblySection = ({ juntaId }: { juntaId: string }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [assemblyData, setAssemblyData] = useState({
    socios: [
      {
        id: 0,
        name: "Hector",
      },
      {
        id: 1,
        name: "Juan",
      },
      {
        id: 2,
        name: "Maria",
      },
    ],
    assemblyDates: [
      new Date().toISOString().split('T')[0],
    ],
    attendance: {
      0: {},
      1: {},
      2: {}
    },
    agenda: [
      "Revisión de cuentas",
      "Aprobación de presupuesto",
      "Elección de tesorero",
    ],
    actaPrevia: [
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
    ],
    compraAcciones: [],
    pagoPrestamos: [],
    solicitudesPrestamos: [],
  })
  const { toast } = useToast()

  // Cargar datos de la asamblea si existe
  const fetchAssemblyData = async () => {
    try {
      const response = await fetch(`/api/juntas/${juntaId}/asamblea`)
      if (response.ok) {
        const data = await response.json()
        setAssemblyData(data)
      }
    } catch (error) {
      console.error('Error fetching assembly data:', error)
    }
  }

  useEffect(() => {
    // fetchAssemblyData()
  }, [juntaId])


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveAssembly = async () => {
    try {
      const response = await fetch(`/api/juntas/${juntaId}/asamblea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assemblyData),
      })
      if (response.ok) {
        toast({
          title: "Asamblea guardada",
          description: "La información de la asamblea se ha guardado exitosamente.",
        })
      } else {
        throw new Error('Failed to save assembly')
      }
    } catch (error) {
      console.error('Error saving assembly:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la información de la asamblea.",
        variant: "destructive",
      })
    }
  }

  const Asistencia = ({ assemblyData }: { assemblyData: any }) => {

    const attendanceStatuses = {
      Asistio: { icon: Check, color: "text-green-500" },
      Tardanza: { icon: Clock, color: "text-yellow-500" },
      Falta: { icon: X, color: "text-red-500" },
    }

    const AttendanceButton: React.FC<{ status: string; onChange: (status: string) => void }> = ({ status, onChange }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[120px]">
              {status ? (
                <>
                  {React.createElement(attendanceStatuses[status as keyof typeof attendanceStatuses].icon, {
                    className: `mr-2 h-4 w-4 ${attendanceStatuses[status as keyof typeof attendanceStatuses].color}`
                  })}
                  {status}
                </>
              ) : (
                "Seleccionar"
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(attendanceStatuses).map((s) => (
              <DropdownMenuItem key={s} onSelect={() => onChange(s)}>
                {React.createElement(attendanceStatuses[s as keyof typeof attendanceStatuses].icon, {
                  className: `mr-2 h-4 w-4 ${attendanceStatuses[s as keyof typeof attendanceStatuses].color}`
                })}
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <div>
        <p className="mb-4">Total socios activos: {assemblyData.socios.length}</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del socio</TableHead>
              {assemblyData.assemblyDates.map((date: string) => (
                <TableHead key={date}>{date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {assemblyData.socios.map((socio: any) => (
              <TableRow key={socio.id}>
                <TableCell>{socio.name}</TableCell>
                {assemblyData.assemblyDates.map((date: string) => (
                  <TableCell key={date}>
                    {date === assemblyData.assemblyDates[assemblyData.assemblyDates.length - 1] ? (
                      <AttendanceButton status={assemblyData.attendance[socio.id]?.[date] || ""} onChange={(status: string) => {
                        setAssemblyData({
                          ...assemblyData,
                          attendance: { ...assemblyData.attendance, [socio.id]: { ...assemblyData.attendance[socio.id], [date]: status } }
                        })
                      }} />
                    ) : (
                      <></>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const Agenda = ({ assemblyData }: { assemblyData: any }) => {
    return <AgendaSection juntaId={juntaId} />
  }

  const CompraAcciones = ({ assemblyData }: { assemblyData: any }) => {
    return <AccionesSection juntaId={juntaId} />
  }

  const ActaPrevia = ({ assemblyData }: { assemblyData: any }) => {
    return <Card>
      <CardHeader>
        <CardTitle>Acta previa</CardTitle>
      </CardHeader>
      <CardContent>
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
            {assemblyData.actaPrevia.map((socio: any) => (
              <TableRow key={socio.id}>
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
      </CardContent>
    </Card>
  }

  const PagoPrestamos = ({ assemblyData }: { assemblyData: any }) => {
    return <>
      <PagosSection juntaId={juntaId} />
    </>
  }

  const SolicitudesPrestamos = ({ assemblyData }: { assemblyData: any }) => {
    return <PrestamosSection juntaId={juntaId} />
  }

  const CierreActa = ({ assemblyData }: { assemblyData: any }) => {
    const attendanceStatuses = {
      Asistio: { icon: Check, color: "text-green-500" },
      Tardanza: { icon: Clock, color: "text-yellow-500" },
      Falta: { icon: X, color: "text-red-500" },
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cierre de Acta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asistencia</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  {assemblyData.assemblyDates.map((date: string) => (
                    <TableHead key={date}>{date}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {assemblyData.socios.map((socio: any) => (
                  <TableRow key={socio.id}>
                    <TableCell>{socio.name}</TableCell>
                    {assemblyData.assemblyDates.map((date: string) => {
                      const status = assemblyData.attendance[socio.id]?.[date] || "";
                      const StatusIcon = attendanceStatuses[status as keyof typeof attendanceStatuses]?.icon;
                      return (
                        <TableCell key={date}>
                          {status && (
                            <div className="flex items-center">
                              <StatusIcon className={`h-4 w-4 mr-2 ${attendanceStatuses[status as keyof typeof attendanceStatuses]?.color}`} />
                              <span>{status}</span>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <h3 className="text-lg font-semibold">Agenda</h3>
            <ul className="list-disc pl-5">
              {assemblyData.agenda.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold">Acta</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Asistencia</TableHead>
                  <TableHead>Acciones Compradas</TableHead>
                  <TableHead>Valor Acciones</TableHead>
                  <TableHead>Pago Capital</TableHead>
                  <TableHead>Pago Intereses</TableHead>
                  <TableHead>Pago Cuota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assemblyData.actaPrevia.map((socio: any, index: number) => (
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
          </div>
        </CardContent>
      </Card>
    )
  }

  const steps = [
    {
      title: "Asistencia", content: (<Asistencia assemblyData={assemblyData} />)
    },
    { title: "Agenda", content: (<Agenda assemblyData={assemblyData} />) },
    { title: "Acta previa", content: (<ActaPrevia assemblyData={assemblyData} />) },
    { title: "Compra de acciones", content: (<CompraAcciones assemblyData={assemblyData} />) },
    { title: "Pago de prestamos", content: (<PagoPrestamos assemblyData={assemblyData} />) },
    { title: "Solicitudes/Registro de prestamos", content: (<SolicitudesPrestamos assemblyData={assemblyData} />) },
    { title: "Cierre de Acta", content: (<CierreActa assemblyData={assemblyData} />) }
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Asamblea</h1>
      <Tabs value={steps[currentStep].title} className="w-full">
        <TabsList className="flex flex-row justify-between">
          {steps.map((step, index) => (
            <TabsTrigger
              key={index}
              value={step.title}
              className="text-sm"
              disabled={index !== currentStep}
            >
              {index + 1}. {step.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((step, index) => (
          <TabsContent key={index} value={step.title}>
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>Step {index + 1} of {steps.length}</CardDescription>
              </CardHeader>
              <CardContent>
                {step.content}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          Regresar
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button
            variant="default"
            onClick={handleSaveAssembly}
          >
            Guardar y Cerrar Acta
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleNext}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )
}

export default AssemblySection