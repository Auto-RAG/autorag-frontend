"use client"; // 클라이언트 컴포넌트로 설정

import { TrialsList } from "@/components/projects/trials-list";

export default function TrialsPage() {
  return (
    <TrialsList projectId="param.project_id" setTrials={() => {}} trials={[]} />
  ); // trials와 setTrials 속성 추가
}
