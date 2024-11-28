import ChunkedPage from "@/components/chunked/chunked-page";


type PageProps = {
    params: Promise<{ project_id: string }>;
  }

export default async function DocumentsPage({ params }: PageProps) {
    const {project_id} = await params;

    return <ChunkedPage project_id={project_id} />;
}
