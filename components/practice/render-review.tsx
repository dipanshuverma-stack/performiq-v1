import React from "react";
import { PracticeReview } from "./practice-review";

interface RenderReviewProps {
  session: any;
  metrics: { accuracy: number; pace: number };
}

export function RenderReview({ session, metrics }: RenderReviewProps) {
  return (
    <PracticeReview
      topic={session.topic}
      accuracy={metrics.accuracy}
      currentPace={metrics.pace}
      notes={session.sessionNotes}
      setNotes={session.setSessionNotes}
      onSave={session.saveAndComplete}
    />
  );
}