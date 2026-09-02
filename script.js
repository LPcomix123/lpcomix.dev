function scrollToProjects() {
    document.getElementById("projects").scrollIntoView({
        behavior: "smooth"
    });
}

async function getLatestCommit() {
    const title = document.getElementById("commit-title");
    const date = document.getElementById("commit-date");
    const link = document.getElementById("commit-link");
    const refreshButton = document.getElementById("refresh-commit");

    title.textContent = "Loading...";
    date.textContent = "Getting latest commit...";
    link.style.display = "none";

    refreshButton.disabled = true;
    refreshButton.textContent = "🔄 Refreshing...";

    try {
        const response = await fetch("/api/latest-commit");

        if (!response.ok) {
            throw new Error("Server could not get the latest commit");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        title.textContent = data.message;

        date.textContent =
            `${data.repository} • ` +
            new Date(data.date).toLocaleString();

        link.href = data.url;
        link.textContent = "View commit →";
        link.style.display = "inline-block";

    } catch (error) {
        console.error("Latest commit error:", error);

        title.textContent = "Couldn't load latest commit";
        date.textContent = error.message;
        link.style.display = "none";
    }

    refreshButton.disabled = false;
    refreshButton.textContent = "🔄 Refresh";
}

getLatestCommit();