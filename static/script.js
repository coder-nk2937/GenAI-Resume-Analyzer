const resumeText = document.getElementById("resumeText");
const charCount = document.getElementById("charCount");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const result = document.getElementById("result");

resumeText.addEventListener("input", () => {
    charCount.textContent = `${resumeText.value.length.toLocaleString()} characters`;
});

clearBtn.addEventListener("click", () => {
    resumeText.value = "";
    charCount.textContent = "0 characters";
    result.className = "result-area empty-state";
    result.innerHTML = `
        <div class="empty-icon">✦</div>
        <h3>Ready to analyze</h3>
        <p>Your resume insights will be displayed here after analysis.</p>
    `;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
});

analyzeBtn.addEventListener("click", async () => {
    const text = resumeText.value.trim();

    if (!text) {
        showError("Please paste your resume details first.");
        resumeText.focus();
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.classList.add("loading");
    analyzeBtn.querySelector(".btn-label").textContent = "Analyzing...";

    result.className = "result-area empty-state";
    result.innerHTML = `
        <div class="empty-icon">⏳</div>
        <h3>Analyzing your resume</h3>
        <p>Please wait while Gemini extracts the information.</p>
    `;
    copyBtn.disabled = true;
    

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_text: text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        result.className = "result-area";
        result.innerHTML = `<pre class="result-text"></pre>`;
        result.querySelector("pre").textContent = data.result || "No result returned.";
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
    } catch (error) {
        showError(error.message);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove("loading");
        analyzeBtn.querySelector(".btn-label").textContent = "Analyze Resume";
    }
});

copyBtn.addEventListener("click", async () => {
    const text = result.innerText.trim();
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy Result", 1500);
    } catch {
        copyBtn.textContent = "Copy failed";
        setTimeout(() => copyBtn.textContent = "Copy Result", 1500);
    }
});


downloadBtn.addEventListener("click", () => {
    const text = result.innerText.trim();

    if (!text) {
        alert("No analysis available to download.");
        return;
    }

    const blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});

downloadBtn.addEventListener("click", () => {
    const text = result.innerText.trim();

    if (!text) {
        alert("No analysis available to download.");
        return;
    }

    const blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-analysis.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});

function showError(message) {
    result.className = "result-area";                
    result.innerHTML = `<div class="error-box"><strong>Analysis failed</strong><br>${escapeHtml(message)}</div>`;
    copyBtn.disabled = true;
    
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}
