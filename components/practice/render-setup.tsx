import React from "react";
import { PracticeSetup } from "./practice-setup";

interface RenderSetupProps {
  session: any;
}

export function RenderSetup({ session }: RenderSetupProps) {
  return (
    <PracticeSetup
      subject={session.subject}
      setSubject={session.setSubject}
      topic={session.topic}
      setTopic={session.setTopic}
      difficulty={session.difficulty}
      setDifficulty={session.setDifficulty}
      onStart={session.startSession}
    />
  );
}