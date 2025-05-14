exports.wordSearch = async (req, res) => {
    const { word } = req.query;

    if (!word) {
        return res.status(400).json({ success: false, message: 'Word is required' });
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            return res.status(404).json({ success: false, message: 'Word not found' });
        }
        const data = await response.json();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
    }
}