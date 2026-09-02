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

    try {
        // Get all public repositories
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`
        );

        if (!response.ok) {
            throw new Error("Could not get repositories");
        }

        const repos = await response.json();

        let latestCommit = null;

        // Check each repository
        for (const repo of repos) {

            const commitResponse = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`
            );

            if (!commitResponse.ok) {
                continue;
            }

            const commits = await commitResponse.json();

            if (commits.length === 0) {
                continue;
            }

            const commit = commits[0];

            // Is this newer than the one we currently have?
            if (
                latestCommit === null ||
                new Date(commit.commit.author.date) >
                new Date(latestCommit.commit.author.date)
            ) {
                latestCommit = commit;
                latestCommit.repoName = repo.name;
            }
        }

        // Nothing found
        if (latestCommit === null) {
            title.textContent = "No commits found";
            date.textContent = "";
            link.style.display = "none";
            return;
        }

        // Display latest commit
        title.textContent = latestCommit.commit.message.split("\n")[0];

        date.textContent =
            `${latestCommit.repoName} • ` +
            new Date(latestCommit.commit.author.date).toLocaleString();

        link.href = latestCommit.html_url;
        link.textContent = "View commit →";
        link.style.display = "inline-block";

    } catch (error) {

        console.error(error);

        title.textContent = "Couldn't load latest commit";
        date.textContent = "Please try again later.";
        link.style.display = "none";
    }
}

getLatestCommit();