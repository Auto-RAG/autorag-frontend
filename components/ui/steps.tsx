import { CheckCircle, Circle, XCircle, Loader2 } from "lucide-react";

interface Step {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={`flex items-center space-x-4 ${
            index <= currentStep ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <div className="flex-shrink-0">
            {step.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
            {step.status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            {step.status === 'in-progress' && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
            {step.status === 'pending' && <Circle className="w-6 h-6" />}
          </div>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 