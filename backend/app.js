// TODO: set production mode

import express from 'express';
import 'dotenv/config'
import OpenAI from "openai";

const openai = new OpenAI({
       apiKey: process.env.OPENAI_API_KEY
})

const app = express();
const PORT = process.env.PORT;

const apipath = '/api/fireplace';
app.use(express.static('../webapp'));
app.use(express.json());

async function fetchGPTCompletion(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt}],
        model: "gpt-3.5-turbo",
  });
  return(completion.choices[0]);
}

async function fetchImage(prompt) {
    const response = await openai.images.generate({
        prompt: "Create an artwork that captures the essence of the following feeling: " + prompt,
        n: 1,
        size: "512x512"
      });
    const image_url = response.data[0].url;
    console.log(response.data)
    return image_url;
}

app.get(apipath + '/emotion/:emotion', async (req, res, next) => {
    console.log("Asking for emotion " + req.params.emotion)

    const emotion = req.params.emotion;
    const prompt = `
    You are a world class therapist. Your patient is feeling ${emotion}.
    You are going to help the user feel better.
    Provide three distinct examples or descriptions of how someone might feel when
    they are ${emotion} so that the patient can choose the one that best describes
    how they are feeling and help you understand them.
    The examples should be written in the first person, as if the patient is describing
    how they are feeling.
    The examples shuold be short and concise, one sentence each. Do not add numbers in front of the sentences.
    `;
    const completion = await fetchGPTCompletion(prompt);
    console.log(completion)
    res.json(completion);
});

app.post(apipath + '/image', async (req, res, next) => {
    console.log("Asking for image ")

    const prompt = req.body.prompt;
    const image_url = await fetchImage(prompt);
    res.json({ image_url });
});

// this is default in case of unmatched routes
app.use(function(req, res) {
    sendError(res, 404, `Unrecognized route for: ${req.url}`);
});

function sendError(res, statusCode, message) {
    console.log(statusCode);
    console.log(message);
    res.status(statusCode);
    res.json({ message, statusCode });
}

function errorHandler(error, req, res, next) {
    console.log(error);
    let statusCode = error?.status ?? 500;
    let message = error?.response?.body?.message ?? error.message;
    sendError(res, statusCode, message);
}

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
