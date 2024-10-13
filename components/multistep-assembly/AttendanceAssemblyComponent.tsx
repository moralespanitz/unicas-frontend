import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Clock } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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

interface AttendanceAssemblySectionProps {
  juntaId: string;
  socios: Socio[];
  assemblyDates: string[];
  attendance: AttendanceData;
  onAttendanceChange: (socioId: number, date: string, status: string) => void;
}

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

const AttendanceAssemblySection = ({juntaId, socios, assemblyDates, attendance, onAttendanceChange }: AttendanceAssemblySectionProps) => {
   return (
    <div>
      <p className="mb-4">Total socios activos: {socios.length}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del socio</TableHead>
            {assemblyDates.map(date => (
              <TableHead key={date}>{date}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {socios.map(socio=> (
            <TableRow key={socio.id}>
              <TableCell>{socio.name}</TableCell>
              {assemblyDates.map(date => (
                <TableCell key={date}>
                  {date === assemblyDates[assemblyDates.length - 1] ? (
                    <AttendanceButton
                      status={attendance[socio.id]?.[date] || ""}
                      onChange={(status: string) => onAttendanceChange(socio.id, date, status)}
                    />
                  ) : (
                    attendance[socio.id]?.[date] && (
                      React.createElement(attendanceStatuses[attendance[socio.id][date] as keyof typeof attendanceStatuses].icon, { 
                        className: `h-5 w-5 ${attendanceStatuses[attendance[socio.id][date] as keyof typeof attendanceStatuses].color}` 
                      })
                    )
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

export default AttendanceAssemblySection