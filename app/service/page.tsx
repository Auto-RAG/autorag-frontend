import { NewProjectButton } from "@/components/projects/new-project-button";
import { ServiceList } from "@/components/service/service-list";

export default function ServicePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AutoRAG projects and monitor their performance
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
