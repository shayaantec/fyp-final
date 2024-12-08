"use client";

import React, { useState } from "react";

export default function Forum() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  const handlePostQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prev) => [
        ...prev,
        { id: Date.now(), text: newQuestion, replies: [] },
      ]);
      setNewQuestion("");
    }
  };

  const handleAddReply = (questionId, reply) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, replies: [...question.replies, reply] }
          : question
      )
    );
  };

  return (
    <div className="forum-container">
      <h1 className="forum-title">Discussion Forum</h1>

      {/* Question Input */}
      <div className="question-input-container">
        <textarea
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="question-textarea"
        />
        <button className="post-question-btn" onClick={handlePostQuestion}>
          Post Question
        </button>
      </div>

      {/* Question List */}
      {questions.length === 0 ? (
        <p className="no-questions-message">
          No questions yet. Be the first to ask!
        </p>
      ) : (
        <div className="questions-list">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onReply={(reply) => handleAddReply(question.id, reply)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, onReply }) {
  const [newReply, setNewReply] = useState("");

  const handlePostReply = () => {
    if (newReply.trim()) {
      onReply(newReply);
      setNewReply("");
    }
  };

  return (
    <div className="question-card">
      <h3 className="question-text">{question.text}</h3>

      {/* Replies */}
      {question.replies.length > 0 ? (
        <ul className="replies-list">
          {question.replies.map((reply, index) => (
            <li key={index} className="reply-text">
              {reply}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-replies-message">No replies yet.</p>
      )}

      {/* Reply Input */}
      <div className="reply-input-container">
        <textarea
          placeholder="Write a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          className="reply-textarea"
        />
        <button className="post-reply-btn" onClick={handlePostReply}>
          Post Reply
        </button>
      </div>
    </div>
  );
}
