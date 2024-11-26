import { ReportPage } from "@/components/projects/trials/report/report-page";

export default async function TrialReportPage({ params }: {params: Promise<{ project_id: string; trial_id: string }>;}) 
{
  const { project_id, trial_id } = await params;

  return (
    <div className="container mx-auto">
      <ReportPage project_id={project_id} trial_id={trial_id} />
    </div>
  );
}
