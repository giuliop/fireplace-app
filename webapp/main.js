const server = 'http://localhost:8080/api/fireplace/';

async function fetchEmotionResponse(emotion) {
    const apiUrl = server + 'emotion/' + emotion;
    console.log(apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();
    displaySentences(data);
}

function displaySentences(sentences) {
    const container = document.getElementById("descriptionContainer");
    container.innerHTML = "";

    sentences.forEach(sentence => {
        const para = document.createElement("p");
        para.textContent = sentence.trim();
        container.appendChild(para);
    });
}
