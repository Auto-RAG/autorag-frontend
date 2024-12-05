import { ReportPage } from "@/components/projects/trials/report/report-page";

export default async function TrialReportPage({ params }: {params: Promise<{ project_id: string; trial_id: string }>;}) 
{
  const { project_id, trial_id } = await params;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

  return (
    <div className="container mx-auto">
      <ReportPage dashboard_url={`${hostUrl}:7690`} project_id={project_id} trial_id={trial_id}/>
    </div>
  );
}
