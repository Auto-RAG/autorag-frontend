import React, { useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  MessageSquare,
  ArrowRightLeft,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";

const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

const EvaluationRadarChat = () => {
  const [direction, setDirection] = useState("horizontal");

  const criteria = [
    {
      name: "Grammar",
      value: 7,
      maxValue: 10,
      color: "#10B981",
      icon: <CheckCircle2 className="w-4 h-4" />,
      tooltip: "문법성 (Grammaticality): 문장 구조의 정확성을 평가",
      description: "문장의 문법적 완성도",
    },
    {
      name: "Answer",
      value: 8,
      maxValue: 10,
      color: "#3B82F6",
      icon: <CircleDot className="w-4 h-4" />,
      tooltip:
        "답변가능성 (Answerability): 질문에 대한 명확한 답변 도출 가능성",
      description: "답변 가능성",
    },
    {
      name: "Relev.",
      value: 9,
      maxValue: 10,
      color: "#8B5CF6",
      icon: <MessageSquare className="w-4 h-4" />,
      tooltip: "관련성 (Relevance): 주어진 컨텍스트와의 연관성",
      description: "관련성",
    },
  ];

  // 레이더 차트용 데이터 변환
  const chartData = [
    {
      subject: "Grammar",
      score: criteria[0].value,
      fullMark: 10,
    },
    {
      subject: "Answer",
      score: criteria[1].value,
      fullMark: 10,
    },
    {
      subject: "Relev.",
      score: criteria[2].value,
      fullMark: 10,
    },
  ];

  return (
    <Card className="w-fit">
      <CardContent className="p-2">
        <div
          className={classNames(
            "flex items-center",
            direction === "horizontal" ? "flex-row gap-8" : "flex-col gap-4",
          )}
        >
          {/* 레이더 차트 */}
          <div
            className={classNames(
              "transition-all duration-300",
              direction === "horizontal" ? "w-32 h-32" : "w-40 h-40",
            )}
          >
            <ResponsiveContainer height="100%" width="100%">
              <RadarChart cx="50%" cy="50%" data={chartData} outerRadius="80%">
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="score"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                  name="Score"
                  stroke="#3B82F6"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 점수 표시 */}
          <div
            className={classNames(
              "flex gap-3",
              direction === "horizontal" ? "flex-col" : "flex-row",
            )}
          >
            {criteria.map((criterion) => (
              <div key={criterion.name} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1 p-1 rounded hover:bg-gray-100"
                  style={{ color: criterion.color }}
                >
                  {React.cloneElement(criterion.icon, {
                    style: { color: criterion.color },
                  })}
                  <span className="text-xs font-medium">{criterion.name}</span>
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: criterion.color }}
                >
                  {criterion.value}/10
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 hover:text-gray-700 w-full"
          onClick={() =>
            setDirection((prev) =>
              prev === "horizontal" ? "vertical" : "horizontal",
            )
          }
        >
          <ArrowRightLeft className="w-3 h-3" />
          {direction === "horizontal" ? "세로 보기" : "가로 보기"}
        </button>
      </CardContent>
    </Card>
  );
};

export default EvaluationRadarChat;
