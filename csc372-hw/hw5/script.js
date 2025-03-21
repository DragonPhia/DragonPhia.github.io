const searchBtn = document.getElementById("searchButton");
const userInput = document.getElementById("githubUsername");
const loadingIndicator = document.getElementById("loadingMessage");

const defaultUser = "DragonPhia"; // Default GitHub username

async function fetchRepos(user) {
    // Show the loading message
    loadingIndicator.style.display = "block";

    const apiUrl = `https://api.github.com/users/${user}/repos?per_page=20&sort=updated`;

    const response = await fetch(apiUrl);

    // Log the number of remaining requests
    const remainingRequests = response.headers.get('X-RateLimit-Remaining');
    console.log(`GitHub API requests remaining: ${remainingRequests}`);

    const repos = await response.json();

    for (const repo of repos) {
        try {
            const commitsUrl = `https://api.github.com/repos/${user}/${repo.name}/commits`;
            const allCommits = await fetchCommits(commitsUrl);
            repo.commits_count = allCommits.length;

            const languagesResponse = await fetch(repo.languages_url);
            const languages = await languagesResponse.json();
            repo.languages = languages && typeof languages === 'object' ? Object.keys(languages) : [];

        } catch (error) {
            console.error("Error fetching additional data:", error);
            repo.commits_count = "Unknown";
            repo.languages = [];
        }
    }

    console.log(repos);

    loadingIndicator.style.display = "none";
    displayRepos(repos);
}

function fetchCommits(apiUrl, allCommits = []) {
    return fetch(apiUrl)
        .then(response => {
            const paginationHeader = response.headers.get('Link');
            const nextPageUrl = getNextPageUrl(paginationHeader);
            return Promise.all([response.json(), nextPageUrl]);
        })
        .then(([commitData, nextPageUrl]) => {
            allCommits.push(...commitData);
            if (nextPageUrl) {
                return fetchCommits(nextPageUrl, allCommits);
            } else {
                return allCommits;
            }
        });
}

function getNextPageUrl(paginationHeader) {
    if (!paginationHeader) return null;
    const linkParts = paginationHeader.split(',');
    for (const link of linkParts) {
        const [url, relation] = link.split(';');
        if (relation.trim() === 'rel="next"') {
            return url.trim().slice(1, -1); 
        }
    }
    return null;
}

function displayRepos(repos) {
    const repoCard = document.querySelector(".repo-card");
    repoCard.innerHTML = ""; // Clear previous content

    for (const repo of repos) {
        const repoElement = document.createElement("div");
        repoElement.classList.add("repo-item");

        const repoName = document.createElement("h3");
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
        repoLink.textContent = repo.name;

        const gitHubIcon = document.createElement('i');
        gitHubIcon.classList.add('fa-brands', 'fa-github', 'fa-lg');

        repoName.appendChild(gitHubIcon);
        repoName.appendChild(repoLink);

        const description = document.createElement("p");
        description.textContent = repo.description || "No description available";

        const info = document.createElement("div");
        info.classList.add("info");

        const languagesElement = document.createElement("p");
        languagesElement.textContent = repo.languages.length > 0 ? `Languages: ${repo.languages.join(", ")}` : "Languages: N/A";

        const commits = document.createElement("p");
        commits.textContent = `Commits: ${repo.commits_count}`;

        const watchers = document.createElement("p");
        watchers.textContent = `Watchers: ${repo.watchers_count}`;

        const created = document.createElement("p");
        created.textContent = `Created: ${new Date(repo.created_at).toLocaleDateString()}`;

        const updated = document.createElement("p");
        updated.textContent = `Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}`;

        info.appendChild(languagesElement);
        info.appendChild(commits);
        info.appendChild(watchers);
        info.appendChild(created);
        info.appendChild(updated);

        repoElement.appendChild(repoName);
        repoElement.appendChild(description);
        repoElement.appendChild(info);

        repoCard.appendChild(repoElement);
    }
}

searchBtn.addEventListener("click", () => {
    const user = userInput.value.trim() || defaultUser;
    fetchRepos(user);
});

// Fetch default username repos on load (my username)
fetchRepos(defaultUser);