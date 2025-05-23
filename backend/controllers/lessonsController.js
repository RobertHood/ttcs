const lessons = require('../models/lessonsModel');

exports.createLesson = async (req, res) => {
  try {
    let exercise = req.body.exercise;
    if (typeof exercise === 'string') {
      exercise = JSON.parse(exercise);
    }

    // Map từng audio file vào đúng exercise[i]
    const filesMap = {};
    req.files.forEach(file => {
      filesMap[file.fieldname] = file.path;
    });

    const exerciseWithAudio = exercise.map((ex, i) => ({
      ...ex,
      audio: filesMap[`audio_${i}`] || null
    }));

    const newLesson = new lessons({
      course: req.body.course,
      title: req.body.title,
      theory: req.body.theory,
      category: req.body.category,
      exercise: exerciseWithAudio
    });

    await newLesson.save();
    res.status(201).json({ success: true, data: newLesson });
  } catch (error) {
    console.error('❌ Error saving lesson:', error);
    res.status(500).json({ success: false, message: 'Failed to create lesson', error: error.message });
  }
};

exports.getLessonById = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await lessons.findById(id).populate({
            path: 'course',
            select: '_id title description'
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get lesson', error: error.message });
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const lessonsList = await lessons.find().populate({
            path: 'course',
            select: '_id title description'
        });
        res.status(200).json({ success: true, data: lessonsList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get lessons', error: error.message });
    }
}

exports.updateLesson = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Parse exercise nếu là string
    if (typeof updateData.exercise === 'string') {
      try {
        updateData.exercise = JSON.parse(updateData.exercise);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid exercise data format' });
      }
    }

    // Map audio files vào exercise
    if (Array.isArray(req.files)) {
      const filesMap = {};
      req.files.forEach(file => {
        filesMap[file.fieldname] = file.path;
      });

      // 👇 Gắn audio đúng vào exercise[i]
      if (Array.isArray(updateData.exercise)) {
        updateData.exercise = updateData.exercise.map((ex, i) => ({
          ...ex,
          audio: filesMap[`audio_${i}`] || ex.audio || null
        }));
      }
    }

    // Update Mongo
    const lesson = await lessons.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('❌ Update lesson error:', error);
    res.status(500).json({ success: false, message: 'Failed to update lesson', error: error.message });
  }
};


exports.deleteLesson = async (req, res) => {
    try {
        const deleted = await lessons.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });

    }
};
