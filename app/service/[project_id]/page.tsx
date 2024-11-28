type PageProps = {
    params: Promise<{ project_id: string }>;
  }

export default async function ServicePage({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div>
      <h1>Project Overview</h1>
    </div>
  );
}
