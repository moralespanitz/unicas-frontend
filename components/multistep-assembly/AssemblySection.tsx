'use client'
import React, { useState, ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Step {
  title: string;
  content: ReactNode;
}

interface AssemblySectionProps {
  steps: Step[];
}

const AssemblySection: React.FC<AssemblySectionProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Asamblea</h1>
      
      <Tabs value={steps[currentStep].title} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2">
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
        <Button 
          variant="default"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export default AssemblySection