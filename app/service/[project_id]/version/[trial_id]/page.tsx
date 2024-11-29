type PageProps = {
  params: Promise<{ 
    project_id: string;
    trial_id: string;
  }>;
}

export default async function VersionDetailPage({ params }: PageProps) {
  const { project_id, trial_id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Trial Details</h1>
      {/* Add trial details content here */}
    </div>
  );
}
