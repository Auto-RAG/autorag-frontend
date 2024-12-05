import { ChatPage } from "@/components/projects/trials/chat/chat-page";

export default async function TrialChatPage({ params }: {params: Promise<{ project_id: string; trial_id: string }>;}) 
{
  const { project_id, trial_id } = await params;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

  return (
    <div className="container mx-auto">
      <ChatPage chat_url={`${hostUrl}:8501`} project_id={project_id} trial_id={trial_id}/>
    </div>
  );
}
