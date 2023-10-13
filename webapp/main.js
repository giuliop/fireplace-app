const server = 'http://10.0.0.16:8080/api/fireplace/';

const debug = false;
//const debug = true;

const cannedSentences = [
    "I often feel like there's a heavy weight pressing down on my shoulders, overpowering me and slowing down my actions.",
    "My mind races all the time, bombarded with endless thoughts and worries that prevent me from focusing on anything.",
    "I feel a constant knot in my stomach, like I'm about to face something terrifying and I can't shake off that uneasy feeling."
];

const cannedImageUrl = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-ycYW9Wh7QaL9NqsA07NUG7jf/user-1ZvXQJzJGpmfV6rPmSfeUiSe/img-eysZJ0sU9MrH1lNvPPcVlQ9X.png?st=2023-10-13T13%3A06%3A49Z&se=2023-10-13T15%3A06%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-13T11%3A55%3A01Z&ske=2023-10-14T11%3A55%3A01Z&sks=b&skv=2021-08-06&sig=Jrp/oitls4Ix5ZF7qhRfhNtik%2B6t3Ce3cJzzRz%2Bwy5M%3D"

async function fetchEmotionResponse(emotion, button) {
    button.classList.add("selected");
    if (debug) {
        // wait three seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        displaySentences(cannedSentences)
        return
    }
    const apiUrl = server + 'emotion/' + emotion;
    console.log(apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();
    let sentences = data.message.content.split("\n");
    sentences = sentences.filter(sentence => sentence.length > 0);
    displaySentences(sentences);
}

function displaySentences(sentences) {
    const title = document.getElementById("mainTitle");
    const buttonContainer = document.getElementById("buttonContainer");
    const descriptionContainer = document.getElementById("descriptionContainer");

    title.innerHTML = "Like one of these?";

    buttonContainer.parentNode.removeChild(buttonContainer);

    sentences.forEach(sentence => {
        const para = document.createElement("p");
        para.textContent = sentence.trim();
        para.onclick = () => {
            para.classList.add("selected");
            displayImage(sentence)
        };
        descriptionContainer.appendChild(para);
    });
}

async function getImageUrl(prompt) {
    if (debug) {
        // wait three seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        return cannedImageUrl;
    }
    const apiUrl = server + 'image/'
    // make a post request to the server to generate an image
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    console.log(data);
    const image_url = data.image_url;
    console.log(image_url);
    return image_url
}

async function displayImage(prompt) {
    const image_url = await getImageUrl(prompt); 

    // show the image and remove the rest
    const title = document.getElementById("mainTitle");
    const descriptionContainer = document.getElementById("descriptionContainer");
    descriptionContainer.parentNode.removeChild(descriptionContainer);
    title.parentNode.removeChild(title);

    const image = document.createElement("img");
    // style the image to fit the screen
    image.style.width = "100%";
    image.src = image_url;
    document.body.appendChild(image);
}
