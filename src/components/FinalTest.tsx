import {
    Box, Button, Typography, Radio, RadioGroup,
    FormControlLabel, FormControl, FormLabel
  } from '@mui/material';
  import { useState, useRef } from 'react';
  
  type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  
  const grammarQuestions: Question[] = [
    {
      question: 'What is the correct past tense of "go"?',
      options: ['goed', 'went', 'goes', 'going'],
      correctAnswer: 'went',
    },
    {
      question: 'Which sentence is grammatically correct?',
      options: ['He go to school.', 'He goes to school.', 'He going to school.', 'He gone to school.'],
      correctAnswer: 'He goes to school.',
    },
  ];
  
  export default function FinalTest() {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [grammarScore, setGrammarScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
  
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
  
    const handleGrammarChange = (questionIndex: number, value: string) => {
      setAnswers({ ...answers, [questionIndex]: value });
    };
  
    const submitGrammar = () => {
      let score = 0;
      grammarQuestions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) score += 1;
      });
      setGrammarScore(score);
      setSubmitted(true);
    };
  
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
  
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
  
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunks.current = [];
      };
  
      recorder.start();
      setRecording(true);
    };
  
    const stopRecording = () => {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    };
  
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Final Test
        </Typography>
  
        {/* Grammar Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Part 1: Grammar
        </Typography>
        {grammarQuestions.map((q, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {index + 1}. {q.question}
              </FormLabel>
              <RadioGroup
                value={answers[index] || ''}
                onChange={(e) => handleGrammarChange(index, e.target.value)}
              >
                {q.options.map((opt, i) => (
                  <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
  
        {!submitted ? (
          <Button
            variant="contained"
            onClick={submitGrammar}
            disabled={Object.keys(answers).length < grammarQuestions.length}
          >
            Submit Grammar
          </Button>
        ) : (
          <Typography sx={{ mt: 2 }}>
            You scored {grammarScore} out of {grammarQuestions.length} in grammar.
          </Typography>
        )}
  
        {/* Speaking Section */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Part 2: Speaking
        </Typography>
        <Typography>Please read aloud: <strong>"I have been learning English every day."</strong></Typography>
  
        <Box sx={{ mt: 2 }}>
          {!recording ? (
            <Button variant="outlined" onClick={startRecording}>
              Start Recording
            </Button>
          ) : (
            <Button variant="contained" color="error" onClick={stopRecording}>
              Stop Recording
            </Button>
          )}
        </Box>
  
        {audioURL && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Playback:</Typography>
            <audio controls src={audioURL}></audio>
          </Box>
        )}
      </Box>
    );
  }
  