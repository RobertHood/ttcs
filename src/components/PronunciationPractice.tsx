import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography
} from '@mui/material';
import { Mic, Stop, Replay } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '62198528ee934e649cba75d89a8f6a42';

// ========== AssemblyAI helper functions ==========
const uploadToAssembly = async (audioBlob: Blob) => {
  const res = await axios.post('https://api.assemblyai.com/v2/upload', audioBlob, {
    headers: {
      authorization: API_KEY,
      'content-type': 'application/octet-stream'
    }
  });
  return res.data.upload_url;
};

const requestTranscription = async (audioURL: string) => {
  const res = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    {
      audio_url: audioURL,
      language_code: 'en_us',
      punctuate: false,
      format_text: false,
      word_boost: [],
    },
    {
      headers: {
        authorization: API_KEY,
        'content-type': 'application/json'
      }
    }
  );
  return res.data.id;
};

const pollTranscription = async (transcriptId: string): Promise<any> => {
  while (true) {
    const res = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { authorization: API_KEY }
    });
    if (res.data.status === 'completed') return res.data;
    if (res.data.status === 'error') throw new Error(res.data.error);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};

const computeScoreAndFeedback = (spoken: string[], expected: string[]) => {
  const matched: string[] = [];
  const missing: string[] = [];
  const wrong: string[] = [];

  expected.forEach((word) => {
    if (spoken.includes(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  spoken.forEach((word) => {
    if (!expected.includes(word)) {
      wrong.push(word);
    }
  });

  const score = Math.floor((matched.length / expected.length) * 100);

  return { score, feedback: { matched, missing, wrong } };
};
// ========== End helpers ==========

export default function PronunciationPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ matched: string[]; missing: string[]; wrong: string[] } | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchPronunciationLessons = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/english/all-lessons');
        const allLessons = res.data.data;
        const pronunciationLessons = allLessons.filter(
          (lesson: any) => lesson.category?.toLowerCase() === 'pronunciation'
        );
        const extractedQuestions = pronunciationLessons.flatMap((lesson: any) => lesson.exercise);
        setQuestions(extractedQuestions);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      }
    };
    fetchPronunciationLessons();
  }, []);

  const handleStartRecording = async () => {
    setScore(null);
    setFeedback(null);
    setAudioURL(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setIsProcessing(true);

      try {
        const uploadURL = await uploadToAssembly(audioBlob);
        const transcriptId = await requestTranscription(uploadURL);
        const result = await pollTranscription(transcriptId);

        const spokenWords = result.words.map((w: any) => w.text.toLowerCase());
        const expectedWords = currentQuestion.question.toLowerCase().split(/\s+/);
        const { score: finalScore, feedback } = computeScoreAndFeedback(spokenWords, expectedWords);

        setScore(finalScore);
        setFeedback(feedback);
      } catch (err) {
        console.error('Analysis failed:', err);
        setScore(null);
        setFeedback(null);
      } finally {
        setIsProcessing(false);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);

    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }, 4000); // tự động dừng sau 4s
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleRetry = () => {
    setScore(null);
    setAudioURL(null);
    setFeedback(null);
  };

  const handleNext = () => {
    setScore(null);
    setAudioURL(null);
    setFeedback(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Practice Pronunciation
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Read aloud the sentence below:
      </Typography>

      {currentQuestion ? (
        <Box sx={{ mb: 4, p: 2, bgcolor: '#f0f0f0', borderRadius: 2 }}>
          {currentQuestion.audio && (
            <Box sx={{ mb: 2 }}>
              <audio controls src={`http://localhost:8001/${currentQuestion.audio}`} />
            </Box>
          )}
          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {currentQuestion.question}
          </Typography>
        </Box>
      ) : (
        <Typography>No more questions available.</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {isRecording ? (
          <>
            <CircularProgress size={80} thickness={4} />
            <Typography>Recording... Speak now</Typography>
            <Button variant="contained" color="error" startIcon={<Stop />} onClick={handleStopRecording}>
              Stop Recording
            </Button>
          </>
        ) : isProcessing ? (
          <>
            <CircularProgress size={80} thickness={4} />
            <Typography>Analyzing your pronunciation...</Typography>
          </>
        ) : score !== null ? (
          <>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Your Score: {score}/100
              </Typography>
              <LinearProgress
                variant="determinate"
                value={score}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Typography color="text.secondary">
                {score >= 90
                  ? 'Excellent pronunciation!'
                  : score >= 70
                  ? 'Good job! Keep practicing.'
                  : 'Needs improvement. Focus on difficult sounds.'}
              </Typography>
            </Box>

            {audioURL && (
              <Box>
                <Typography sx={{ mb: 1 }}>Your Recording:</Typography>
                <audio controls src={audioURL}></audio>
              </Box>
            )}

            {feedback && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6">Chi tiết nhận xét:</Typography>
                {feedback.matched.length > 0 && (
                  <Typography sx={{ color: 'green' }}>
                    ✅ Phát âm đúng: {feedback.matched.join(', ')}
                  </Typography>
                )}
                {feedback.missing.length > 0 && (
                  <Typography sx={{ color: 'orange' }}>
                    ⚠️ Thiếu từ: {feedback.missing.join(', ')}
                  </Typography>
                )}
                {feedback.wrong.length > 0 && (
                  <Typography sx={{ color: 'red' }}>
                    ❌ Từ không đúng: {feedback.wrong.join(', ')}
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" startIcon={<Replay />} onClick={handleRetry}>
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={handleNext}
                disabled={currentQuestionIndex + 1 >= questions.length}
              >
                Next Sentence
              </Button>
            </Box>
          </>
        ) : (
          <Button
            variant="contained"
            size="large"
            startIcon={<Mic />}
            onClick={handleStartRecording}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Start Recording
          </Button>
        )}
      </Box>
    </Box>
  );
}
