import Link from 'next/link';

type PageProps = {
  params: Promise<{ project_id: string; trial_id: string }>;
  children: React.ReactNode;
}

export default async function TrialLayout({ params, children }: PageProps) {
  const { project_id, trial_id } = await params;

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <div className="mb-4 flex items-center gap-2">
        <Link 
          className="text-sm text-gray-500 hover:text-gray-700"
          href={`/projects/${project_id}/trials`}
        >
          ← Back to Trials
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-sm font-medium">Trial {trial_id}</span>
      </div>

      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
