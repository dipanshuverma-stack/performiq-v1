# PerformIQ V2 Database Design

## Core

User

ExamProfile
- id
- userId
- examName
- targetDate

Subject
- id
- examProfileId
- name

Topic
- id
- subjectId
- name

Subtopic
- id
- topicId
- name
- masteryLevel

## Mocks

MockTest
- stage (Prelims/Mains)
- score
- maxMarks
- accuracy
- correctAnswers
- wrongAnswers

MockSection
- mockId
- subject
- score

## Learning

PracticeSession

Mistake
- reason
- description

RevisionRecord

## Intelligence

Goal

Insight

AIAnalysisCache
- type
- result
- expiresAt