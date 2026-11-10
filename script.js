const container = document.createElement("main");
container.className = "app-layout";

const generator = document.createElement("section");
generator.className = "card generator-card";

const heading = document.createElement("h1");
heading.textContent = "AI-Powered Content Generator";

const input = document.createElement("textarea");
input.className = "text-input";
input.placeholder = "Ask anything...";
input.setAttribute("aria-label", "Enter a question");
input.rows = 3;

const sendButton = document.createElement("button");
sendButton.className = "button";
sendButton.type = "button";
sendButton.textContent = "Get answer";

const answer = document.createElement("div");
answer.className = "result";
answer.setAttribute("aria-live", "polite");

const summarizeButton = document.createElement("button");
summarizeButton.className = "button button-secondary";
summarizeButton.type = "button";
summarizeButton.textContent = "Summarize answer";

const summary = document.createElement("div");
summary.className = "result";
summary.setAttribute("aria-live", "polite");

const definitionCard = document.createElement("section");
definitionCard.className = "card definition-card";

const definitionHeading = document.createElement("h2");
definitionHeading.textContent = "Quick definition";

const definitionInput = document.createElement("input");
definitionInput.className = "text-input";
definitionInput.type = "text";
definitionInput.placeholder = "Write any topic...";
definitionInput.setAttribute("aria-label", "Topic to define");

const definitionButton = document.createElement("button");
definitionButton.className = "button";
definitionButton.type = "button";
definitionButton.textContent = "Get definition";

const definition = document.createElement("div");
definition.className = "result";
definition.setAttribute("aria-live", "polite");

const API_KEY = "AIzaSyBPhEYlBF7XD_m4qvcPGDuCkqC4u8PZuA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function generateContent(prompt, resultElement) {
    resultElement.textContent = "Loading...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const data = await response.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        resultElement.textContent = result || "No answer was returned.";
    } catch (error) {
        resultElement.textContent = "Error generating answer.";
        console.error(error);
    }
}

sendButton.addEventListener("click", async () => {
    const question = input.value.trim();
    if (!question) {
        answer.textContent = "Enter a question to get started.";
        input.focus();
        return;
    }

    await generateContent(`${question} give me answer`, answer);
    input.value = "";
});

summarizeButton.addEventListener("click", async () => {
    if (!answer.textContent.trim()) {
        summary.textContent = "Generate an answer before requesting a summary.";
        return;
    }

    await generateContent(`${answer.textContent} give me summary`, summary);
});

definitionButton.addEventListener("click", async () => {
    const topic = definitionInput.value.trim();
    if (!topic) {
        definition.textContent = "Enter a topic to get its definition.";
        definitionInput.focus();
        return;
    }

    await generateContent(`give me exact 3 line definition about ${topic}`, definition);
});

generator.append(heading, input, sendButton, answer, summarizeButton, summary);
definitionCard.append(definitionHeading, definitionInput, definitionButton, definition);
container.append(generator, definitionCard);
document.body.append(container);
