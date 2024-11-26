import { QAOverview } from "@/components/qa/qa-overview"

interface QAPageProps {
  params: {
    project_id: string
  }
}

export default async function QAPage({ params }: QAPageProps) {
  const { project_id } = await params;

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">QA</h1>
      <QAOverview projectId={project_id} />
    </div>
  )
}
