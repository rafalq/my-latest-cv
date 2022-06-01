function getUserInfo(user) {
	const githubUsername = document.getElementById(
		"gh-username"
	).innerHTML;
	if (!githubUsername) {
		githubUsername.innerHTML = "";
	}
	return `
        <div class="gh-avatar">
            <a href="${user.html_url} target="_blank">
                <img src="${user.avatar_url}" width="80" alt="${user.login}">
            </a>
        </div>
        <p>Followers: ${user.followers} | Following: ${user.following}
        <p class="github-repos">Repos: ${user.public_repos}</p>
        </p>`;
}

function getReposInfo(repos) {
	if (repos.length > 0) {
		const listItem = repos.map(function (repo) {
			return `<li>
						<a href="${repo.html_url}" target="_blank
						">${repo.name}</a>
					</li>`;
		});

		return `<div class="repo-list">
					<ul>${listItem.join("\n")}</ul>
				</div>`;
	}
	return `<div class="repo-list"></div>`;
}

function fetchGitHubInfo() {
	const githubUserData = document.getElementById(
		"gh-user-data"
	);
	githubUserData.innerHTML = "";

	const githubRepoData = document.getElementById(
		"gh-repo-data"
	);
	githubRepoData.innerHTML = "";

	const githubUsernameVal =
		document.getElementById("gh-username").value;

	if (!githubUsernameVal) {
		githubUserData.innerHTML = `<h5>Please enter a GitHub username</h5>`;
		return;
	}

	githubUserData.innerHTML = `<div class="loader"></div>`;

	Promise.all([
		fetch(
			`https://api.github.com/users/${githubUsernameVal}`
		)
			.then((response) => {
				if (response.status === 404) {
					githubUserData.innerHTML = `<h5>No info found for user ${githubUsernameVal}</h5>`;
					return;
				} else if (response.status === 403) {
					let resetTime = new Date(
						response.headers.get(
							"X-RateLimit-Reset"
						) * 1000
					);
					githubUserData.innerHTML = `<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`;
					return;
				} else if (response.status !== 200) {
					githubUserData.innerHTML = `<h5>Error: ${
						response.json().message
					}</h5>`;
					return;
				}
				return response.json();
			})
			.then(
				(userData) =>
					(githubUserData.innerHTML =
						getUserInfo(userData))
			)
			.catch((error) => console.error(error)),
		fetch(
			`https://api.github.com/users/${githubUsernameVal}/repos`
		)
			.then((response) => response.json())
			.then((reposData) => {
				githubRepoData.innerHTML =
					getReposInfo(reposData);
			}),
	]);
}

let userInputEl = document.getElementById(
	"gh-username"
);

userInputEl.addEventListener("keyup", () =>
	fetchGitHubInfo()
);

fetchGitHubInfo();
