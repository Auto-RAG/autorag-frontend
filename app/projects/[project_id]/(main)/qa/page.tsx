import { QAOverview } from "@/components/qa/qa-overview";


export default async function QAPage({ params }: {params: Promise<{project_id: string}>}) {
  const project_id = (await params).project_id;

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">QA</h1>
      <QAOverview projectId={project_id} />
    </div>
  )
}
