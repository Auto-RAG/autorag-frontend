import { NewProjectButton } from "@/components/projects/new-project-button";
import { ServiceList } from "@/components/service/service-list";

export default function ServicePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AutoRAG Projects</h1>
          <p className="text-muted-foreground mt-1">
            Your optimized RAG is only few clicks away
          </p>
        </div>
        <div>
          <NewProjectButton />
        </div>
      </div>
      <ServiceList />

    </div>
  );
}
