import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { APIClient } from "@/lib/api-client"

interface CreateTrialButtonProps {
  projectId: string;
  onTrialCreated: () => void;
}

export function CreateTrialButton({ projectId, onTrialCreated }: CreateTrialButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [config, setConfig] = useState("")
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
// 기존 코드에서 다음 부분을 수정
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let configObj = null
      if (config.trim()) {
        try {
          configObj = JSON.parse(config)
        } catch (error) {
          alert("Invalid JSON configuration")
          return
        }
      }
  
      await apiClient.createTrial(projectId, {
        name: name,
        config: configObj
      })
      
      setOpen(false)
      setName("")
      setConfig("")
      onTrialCreated()
    } catch (error) {
      console.error("Error creating trial:", error)
      alert("Failed to create trial")
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create New Trial</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Trial Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter trial name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder="Enter JSON configuration (optional)"
              className="h-32"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Trial
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 