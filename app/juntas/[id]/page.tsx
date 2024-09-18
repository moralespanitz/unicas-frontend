'use client';
import AcccionesSection from "@/components/AccionesSection";
import AgendaSection from "@/components/AgendaSection";
import CapitalSocialSection from "@/components/CapitalSocialSection";
import MemberSection from "@/components/MemberSection";
import MultaSection from "@/components/MultasSection";
import PagosSection from "@/components/PagosSection";
import PrestamosSection from "@/components/PrestamosSection";
import ResumenSection from '@/components/ResumenSection';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const UNICAVecinalDashboard = ({ params }: { params: { id: string } }) => {
    const [isClient, setIsClient] = useState(false);
    const [junta, setJunta] = useState<any>();
    const handleGetJunta = () => {
        fetch(`/api/juntas/${params.id}`)
            .then(response => response.json())
            .then(data => {
                setJunta(data)
            })
            .catch(error => {
                console.error('Error fetching junta:', error);
            });
    }
    
    useEffect(() => {
        setIsClient(true);
        handleGetJunta();
    }, []);


    if (!isClient) { return <h1>Not client</h1> }
    return (
        <div className="container mx-auto p-6 bg-white flex justify-center h-max">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">UNICA Vecinal 2023</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='mb-4'>
                            <h1 className='text-xl font-semibold'>{junta ? junta.name : 'No junta'} </h1>
                        </div>
                        <Link href="/">
                            <Button variant="outline" className="mb-4">Todas las juntas</Button>
                        </Link>
                    </div>
                    <Tabs defaultValue="resumen" className="w-full">
                        <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
                            <TabsTrigger value="resumen">Resumen</TabsTrigger>
                            <TabsTrigger value="miembros">Miembros</TabsTrigger>
                            <TabsTrigger value="prestamos">Préstamos</TabsTrigger>
                            <TabsTrigger value="multas">Multas</TabsTrigger>
                            <TabsTrigger value="acciones">Acciones</TabsTrigger>
                            <TabsTrigger value="pagos">Pagos</TabsTrigger>
                            <TabsTrigger value="capital">Capital Social</TabsTrigger>
                            <TabsTrigger value="agenda">Agenda</TabsTrigger>
                            {/* <TabsTrigger value="asamblea">Asamblea</TabsTrigger> */}
                        </TabsList>
                        <div className="bg-card text-card-foreground rounded-lg p-6">
                            <TabsContent value="resumen">
                                <ResumenSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="miembros">
                                <MemberSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="prestamos">
                                <PrestamosSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="multas">
                                <MultaSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="acciones">
                                <AcccionesSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="pagos">
                                <PagosSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="capital">
                                <CapitalSocialSection juntaId={params.id} />
                            </TabsContent>
                            <TabsContent value="agenda">
                                <AgendaSection juntaId={params.id} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default UNICAVecinalDashboard;