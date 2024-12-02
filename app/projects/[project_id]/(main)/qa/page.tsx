import { QAOverview } from "@/components/qa/qa-overview"

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">QA</h1>
      <QAOverview projectId={project_id} />
    </div>
  )
}
