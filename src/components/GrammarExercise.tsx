import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useState } from 'react';

const questions = [
  {
    question: "She ___ to the store yesterday.",
    options: ["go", "goes", "went", "gone"],
    correctAnswer: "went"
  },
  {
    question: "If I ___ you, I would apologize.",
    options: ["am", "was", "were", "be"],
    correctAnswer: "were"
  },
  {
    question: "They have ___ working here since 2010.",
    options: ["been", "being", "be", "were"],
    correctAnswer: "been"
  },
  {
    question: "He usually ___ up at 6 a.m.",
    options: ["get", "gets", "got", "getting"],
    correctAnswer: "gets"
  },
  {
    question: "We ___ dinner when the phone rang.",
    options: ["had", "were having", "have", "has"],
    correctAnswer: "were having"
  },
  {
    question: "I ___ to Paris three times.",
    options: ["have been", "was", "am", "had gone"],
    correctAnswer: "have been"
  },
  {
    question: "She ___ English very well.",
    options: ["speak", "speaks", "spoke", "speaking"],
    correctAnswer: "speaks"
  },
  {
    question: "The cake ___ by my mom.",
    options: ["made", "was made", "is making", "makes"],
    correctAnswer: "was made"
  },
  {
    question: "They ___ when I arrived.",
    options: ["sleep", "slept", "were sleeping", "sleeping"],
    correctAnswer: "were sleeping"
  },
  {
    question: "I will call you when I ___ home.",
    options: ["get", "got", "getting", "gets"],
    correctAnswer: "get"
  }
];

export default function GrammarExercise() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    setCurrentQuestion(prev => (prev + 1) % questions.length);
    setSubmitted(false);
  };

  const isCorrect = (questionIndex: number) => {
    return selectedAnswers[questionIndex] === questions[questionIndex].correctAnswer;
  };

  const calculateScore = () => {
    const correctCount = questions.reduce((count, question, index) => {
      return count + (isCorrect(index) ? 1 : 0);
    }, 0);
    return Math.round((correctCount / questions.length) * 100);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Grammar Exercise
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Question {currentQuestion + 1}/{questions.length}: {questions[currentQuestion].question}
        </Typography>
        
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                disabled={submitted}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      {submitted && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography sx={{ mb: 1, color: isCorrect(currentQuestion) ? 'success.main' : 'error.main' }}>
            {isCorrect(currentQuestion) ? '✓ Correct!' : '✗ Incorrect!'}
          </Typography>
          <Typography>
            The correct answer is: <strong>{questions[currentQuestion].correctAnswer}</strong>
          </Typography>
          {!isCorrect(currentQuestion) && (
            <Typography sx={{ mt: 1 }}>
              <strong>Explanation:</strong> {getExplanation(currentQuestion)}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        {!submitted ? (
          <Button variant="contained" onClick={handleSubmit}>
            Submit Answer
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next Question
          </Button>
        )}
      </Box>

      {submitted && currentQuestion === questions.length - 1 && (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Score: {calculateScore()}%
          </Typography>
          <Typography>
            You answered {calculateScore() / 20} out of {questions.length} questions correctly.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function getExplanation(questionIndex: number) {
  const explanations = [
    "Use 'went' for past simple tense of 'go'.",
    "In second conditional sentences, we use 'were' for all subjects.",
    "'Have been' is the present perfect continuous form."
  ];
  return explanations[questionIndex];
}