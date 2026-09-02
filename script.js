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
    date.textContent = "Checking GitHub...";
    link.style.display = "none";

    refreshButton.disabled = true;
    refreshButton.textContent = "🔄 Refreshing...";

    try {
        // Get all public repositories
        let repos = [];
        let page = 1;

        while (true) {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`
            );

            if (!response.ok) {
                throw new Error("Could not get repositories");
            }

            const pageRepos = await response.json();

            repos.push(...pageRepos);

            if (pageRepos.length < 100) {
                break;
            }

            page++;
        }

        let latestCommit = null;
        let latestRepo = null;

        // Check every repository
        for (const repo of repos) {
            const response = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`
            );

            if (!response.ok) {
                continue;
            }

            const commits = await response.json();

            if (!Array.isArray(commits) || commits.length === 0) {
                continue;
            }

            const commit = commits[0];

            const commitDate = new Date(
                commit.commit.author.date
            );

            if (
                latestCommit === null ||
                commitDate > new Date(latestCommit.commit.author.date)
            ) {
                latestCommit = commit;
                latestRepo = repo;
            }
        }

        if (latestCommit === null) {
            title.textContent = "No commits found";
            date.textContent = "No public repository commits were found.";
            return;
        }

        // Display commit message
        title.textContent =
            latestCommit.commit.message.split("\n")[0];

        // Display repository + date
        date.textContent =
            `${latestRepo.name} • ` +
            new Date(
                latestCommit.commit.author.date
            ).toLocaleString();

        // Link to commit
        link.href = latestCommit.html_url;
        link.textContent = "View commit →";
        link.style.display = "inline-block";

    } catch (error) {
        console.error("GitHub error:", error);

        title.textContent = "Couldn't load latest commit";
        date.textContent = "GitHub could not be reached.";
    }

    refreshButton.disabled = false;
    refreshButton.textContent = "🔄 Refresh";
}

getLatestCommit();