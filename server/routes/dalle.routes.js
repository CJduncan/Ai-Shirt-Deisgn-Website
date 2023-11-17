import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: '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', // It's safer to use an environment variable for the API key
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" })
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("Received request with prompt:", prompt);

        const response = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        });

        // Log the entire response to check its structure
        console.log("Full Response from OpenAI:", response);

        // Adjust the following line based on the actual structure of the response
        const imageData = response.data; // Example - modify based on actual response

        if (imageData) {
            res.status(200).json({ photo: imageData });
        } else {
            res.status(500).json({ message: "Image data is undefined" });
        }
    } catch (error) {
        console.error("Error in /api/v1/dalle POST route:", error);
        res.status(500).json({ message: "Something went wrong on the server" });
    }
});

export default router;
