function scrollToProjects() {
    document.getElementById("projects").scrollIntoView({
        behavior: "smooth"
    });
}

const username = "LPcomix123";

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
        const response = await fetch(
            `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc&per_page=1`,
            {
                headers: {
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        );

        const data = await response.json();

        console.log("GitHub response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || `GitHub returned ${response.status}`
            );
        }

        if (!data.items || data.items.length === 0) {
            throw new Error("No commits found");
        }

        const commit = data.items[0];

        title.textContent =
            commit.commit.message.split("\n")[0];

        date.textContent =
            `${commit.repository.name} • ` +
            new Date(commit.commit.author.date).toLocaleString();

        link.href = commit.html_url;
        link.textContent = "View commit →";
        link.style.display = "inline-block";

    } catch (error) {
        console.error("GitHub error:", error);

        title.textContent = "Couldn't load latest commit";
        date.textContent = error.message;

        link.style.display = "none";
    }

    refreshButton.disabled = false;
    refreshButton.textContent = "🔄 Refresh";
}

getLatestCommit();