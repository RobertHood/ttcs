import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography
} from '@mui/material';
import { Mic, Stop, Replay } from '@mui/icons-material';
import { useRef, useState } from 'react';

export default function PronunciationPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setScore(null);
    setAudioURL(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      // Simulate pronunciation analysis
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setScore(Math.floor(Math.random() * 40) + 60); // Score between 60-100
      }, 2000);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleRetry = () => {
    setScore(null);
    setAudioURL(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Practice Pronunciation
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Read aloud the sentence below:
      </Typography>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        "The quick brown fox jumps over the lazy dog."
      </Typography>

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

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" startIcon={<Replay />} onClick={handleRetry}>
                Try Again
              </Button>
              <Button variant="outlined">Next Sentence</Button>
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

      {score !== null && (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Feedback
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Strengths:</strong> Good intonation and rhythm
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Areas to improve:</strong> The "th" sound in "the" needs more clarity
          </Typography>
          <Typography>
            <strong>Tip:</strong> Place your tongue between your teeth for "th" sounds
          </Typography>
        </Box>
      )}
    </Box>
  );
}
