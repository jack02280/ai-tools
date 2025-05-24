const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: 'eb2ae97c-cae5-49a0-bee0-0383be29f7c4',
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({
      model: "ep-20250523212641-p57jd",
      prompt: prompt,
      size: "1024x1024",
      response_format: "b64_json"
    });
    
    res.json(response.data[0]);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 