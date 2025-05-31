"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"

interface AiAgentModalProps {
  open: boolean
  onClose: () => void
}

const steps = [
  {
    id: 1,
    title: "Submit Transaction",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Verifying Win With Flare",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 3,
    title: "Report submitted!",
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
]

export function AiAgentModal({ open, onClose }: AiAgentModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setCurrentStep(1)
      setIsLoading(true)
      return
    }

    const processSteps = async () => {
      // Step 1: Submit Transaction
      setCurrentStep(1)
      setIsLoading(true)

      // Random delay between 1-3 seconds
      const delay1 = Math.random() * 2000 + 1000
      await new Promise((resolve) => setTimeout(resolve, delay1))

      setIsLoading(false)

      // Brief pause to show completed step
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Verifying Win With Flare
      setCurrentStep(2)
      setIsLoading(true)

      // Random delay between 1-3 seconds
      const delay2 = Math.random() * 2000 + 1000
      await new Promise((resolve) => setTimeout(resolve, delay2))

      setIsLoading(false)

      // Brief pause to show completed step
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Report submitted!
      setCurrentStep(3)
      setIsLoading(false)
    }

    processSteps()
  }, [open])

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Processing Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {steps.map((step) => {
            const isCurrentStep = step.id === currentStep
            const isCompleted = step.id < currentStep
            const isActive = step.id <= currentStep

            return (
              <div key={step.id} className="flex items-center space-x-4">
                {/* Step Number/Icon */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-300 ${
                      isCompleted ? step.color : isCurrentStep ? step.color : "bg-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isCurrentStep && isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      step.id
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                    isActive ? step.bgColor : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? step.textColor : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  {isCurrentStep && isLoading && <div className="text-sm text-gray-500 mt-1">Processing...</div>}
                  {isCompleted && <div className="text-sm text-green-600 mt-1">Completed</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Close Button - Only show when all steps are complete */}
        {currentStep === 3 && !isLoading && (
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 text-white px-8">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
