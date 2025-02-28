import ParseTabContent from "@/components/parsings/parse-results-tab";


type PageProps = {
    params: Promise<{ project_id: string }>;
  }

export default async function DocumentsPage({ params }: PageProps) {
    const {project_id} = await params;

    return <ParseTabContent project_id={project_id}/>;
}
