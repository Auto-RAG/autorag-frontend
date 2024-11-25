import { TrialsList } from "@/components/projects/trials-list";

type PageProps = {
    params: Promise<{ project_id: string }>;
}

export default async function TrialsPage({ params }: PageProps) {
    const { project_id } = await params;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Trials</h1>
            </div>
            <TrialsList projectId={project_id} />
        </div>
    );
}
