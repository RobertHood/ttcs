import React from 'react';
import { Box, Button, TextField, Typography, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function RoadmapEditor({
  roadmap,
  setRoadmap,
  courseId
}: {
  roadmap: any[];
  setRoadmap: (r: any[]) => void;
  courseId: string;
}) {

  async function updateRoadmapOnServer(courseId: string, newRoadmap: any[]) {
  await fetch(`http://localhost:8001/api/courses/${courseId}/roadmap`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ roadmap }),
  credentials: 'include'
});
}  
    
    const handleUpdate = (updatedRoadmap: any[]) => {
    setRoadmap(updatedRoadmap);
    updateRoadmapOnServer(courseId, updatedRoadmap); // Call backend update
  };

  const addSection = () => {
    handleUpdate([
      ...roadmap,
      { title: '', description: '', lessons: [], order: roadmap.length + 1 }
    ]);
  };

  const removeSection = (idx: number) => {
    const updated = roadmap.filter((_, i) => i !== idx);
    handleUpdate(updated);
  };

  const updateSection = (idx: number, field: string, value: string) => {
    const updated = [...roadmap];
    updated[idx][field] = value;
    handleUpdate(updated);
  };

  const addLesson = (sectionIdx: number) => {
    const updated = [...roadmap];
    updated[sectionIdx].lessons.push({ title: '' });
    handleUpdate(updated);
  };

  const removeLesson = (sectionIdx: number, lessonIdx: number) => {
    const updated = [...roadmap];
    updated[sectionIdx].lessons = updated[sectionIdx].lessons.filter((_: any, i: number) => i !== lessonIdx);
    handleUpdate(updated);
  };

  const updateLesson = (sectionIdx: number, lessonIdx: number, value: string) => {
    const updated = [...roadmap];
    updated[sectionIdx].lessons[lessonIdx].title = value;
    handleUpdate(updated);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Lộ trình khóa học</Typography>
      {roadmap.map((section, idx) => (
        <Box key={idx} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              label="Tên phần"
              value={section.title}
              onChange={e => updateSection(idx, 'title', e.target.value)}
              sx={{ flex: 1 }}
              size="small"
            />
            <IconButton onClick={() => removeSection(idx)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <TextField
            label="Mô tả phần"
            value={section.description}
            onChange={e => updateSection(idx, 'description', e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Bài học</Typography>
          {section.lessons.map((lesson: any, lidx: number) => (
            <Box key={lidx} display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
              <TextField
                label={`Tên bài học #${lidx + 1}`}
                value={lesson.title}
                onChange={e => updateLesson(idx, lidx, e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => removeLesson(idx, lidx)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addLesson(idx)}
            size="small"
            sx={{ mt: 1 }}
          >
            Thêm bài học
          </Button>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addSection}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Thêm phần mới
      </Button>
    </Box>
  );
}