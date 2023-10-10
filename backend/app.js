// TODO: set production mode
import express from 'express';
import 'dotenv/config'

const OPENAI_KEY = process.env.OPENAI_KEY;

const app = express();
const PORT = process.env.PORT;

const apipath = '/api/fireplace';

app.use(express.static('../webapp'));

app.use(express.json());

function fetchEmotionResponse(emotion) {
}    

app.get(apipath + '/emotion/:emotion', async (req, res, next) => {
    const result = ["You are feeling " + req.params.emotion.toLowerCase() + "."];
    res.json(result);
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