import { ChatPage } from "@/components/projects/trials/chat/chat-page";

export default async function TrialChatPage({ params }: {params: Promise<{ project_id: string; trial_id: string }>;}) 
{
  const { project_id, trial_id } = await params;

  return (
    <div className="container mx-auto">
      <ChatPage project_id={project_id} trial_id={trial_id} />
    </div>
  );
}
