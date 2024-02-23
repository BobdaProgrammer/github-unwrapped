let languages = {};
let starred = [];
let hours = {};
let days = {};
const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");
let username = "";
let summary = "";

let results = {
  MUL: "",
  RS: "",
  TOC: "",
  DOC: "",
  PRM: "",
  NOC: 0,
};
//MUL = most used languages, RS = repo's starred, TOC = most common hours of commits(time of commits), Day of commits (most common days of commits), PRM = pull requests merged, NOC = number of contributions
//displaying the data
function productive() {
  document.body.innerHTML = `    <div class="tile">
        <div class="languagetitle">Your most productive days</div>
        <div class="board">
        <div class="pl" id="first"><div class="box">1</div><div class="name"></div></div>
        <div class="pl" id="second"><div class="box">2</div><div class="name"></div></div>
        <div class="pl" id="third"><div class="box">3</div><div class="name"></div></div>
        </div>
        <div class="languagetitle">Your most productive hours</div>
        <div class="board">
        <div class="pl" id="first1"><div class="box">1</div><div class="name"></div></div>
        <div class="pl" id="second1"><div class="box">2</div><div class="name"></div></div>
        <div class="pl" id="third1"><div class="box">3</div><div class="name"></div></div>
        </div>
        <button onclick="final();" class="next">next ⮕</button>
    </div>
    <script src="main.js"></script>`;
  document.getElementById("first").children[1].innerHTML = results["DOC"][0];
  document.getElementById("second").children[1].innerHTML = results["DOC"][1];
  document.getElementById("third").children[1].innerHTML = results["DOC"][2];
  document.getElementById("first1").children[1].innerHTML = results["TOC"][0];
  document.getElementById("second1").children[1].innerHTML = results["TOC"][1];
  document.getElementById("third1").children[1].innerHTML = results["TOC"][2];
}

function final() {
  document.body.innerHTML = `    <div class="tile">
        <div class="languagetitle">Pull requests merged</div>
        <div class="circle">
        <div id="name" class="PRM"></div>
        </div>
        <div class="languagetitle">Your total contributions this year</div>
        <div class="circle"><div id="contribname" class="contrib"></div>
        <button onclick="summaryof();" class="next">Text summary ⮕</button>
    </div>
    <script src="main.js"></script>`;
  document.getElementById("name").innerHTML = results["PRM"];
  document.getElementById("contribname").innerHTML = results["NOC"];
}
function summaryof() {
  document.body.innerHTML = `
        <div class="languagetitle">Your summary:</div>
        <p style="color: #BE3E82; font-size: 40px;">${summary}</p>
    <script src="main.js"></script>`;
  document.body.style = "background-color: #2C2A4A; text-align: center;";
}
async function getContributions() {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query:
      "query {viewer {contributionsCollection {contributionCalendar {totalContributions}}}}",
  };
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  results["NOC"] =
    data.data.viewer.contributionsCollection.contributionCalendar.totalContributions;
  return data;
}
function fetchMerged(link) {
  return fetch(link, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      results["PRM"] = data["total_count"];
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}
function fetchlanguage(link) {
  return fetch(link, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      for (let key in data) {
        languages[key]
          ? (languages[key] += data[key])
          : (languages[key] = data[key]);
      }
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}
function fetchStarred(link) {
  return fetch(link, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      for (let key in data) {
        starred.push(data[key]["name"]);
      }
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}
function getHourAndDay(link) {
  link = link.slice(0, link.length - 6);
  return fetch(link, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      let daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      for (let key in data) {
        let date = new Date(data[key]["commit"]["committer"]["date"]);
        let hour = JSON.stringify(date.getHours()) + "T";
        let day = daysOfWeek[date.getDay()];
        hours[hour] ? (hours[hour] += 1) : (hours[hour] = 1);
        days[day] ? (days[day] += 1) : (days[day] = 1);
      }
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  fetch(`https://github.com/login/oauth/access_token`,{
    Method:"POST",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }).then(response => response.json())
  .then(data=>{
    console.log(data)
    token = data.access_token
  })
  let username;
  fetch("https://api.github.com/user",{
   headers:{
      Authorization: `bearer ${token}`,
   },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.login);
    // Extract the username from the response data
    username = data.login; // 'login' is the key for the username in the GitHub API response
  })
  .catch(error => {
    console.error('Error fetching user info:', error);
  });
  fetch("https://api.github.com/users/" + username + "/repos", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      let promises = [];
      for (let repo in data) {
        promises.push(fetchlanguage(data[repo]["languages_url"]));
        promises.push(getHourAndDay(data[repo]["commits_url"]));
      }
      promises.push(getContributions());
      promises.push(
        fetchMerged(
          `https://api.github.com/search/issues?q=is:pr+author:${username}+is:merged`
        )
      );
      promises.push(
        fetchStarred(`https://api.github.com/users/${username}/starred`)
      );
      return Promise.all(promises);
    })
    .then(() => {
      let sortedLanguages = Object.entries(languages).sort(
        (a, b) => b[1] - a[1]
      );
      let sortedHours = Object.entries(hours).sort((a, b) => b[1] - a[1]);
      let sortedDays = Object.entries(days).sort((a, b) => b[1] - a[1]);
      let topThreeLanguages = sortedLanguages
        .slice(0, 3)
        .map((language) => language[0]);
      let topThreeHours = sortedHours
        .slice(0, 3)
        .map((time) => time[0].replace("T", "") + ":00");
      results["MUL"] = topThreeLanguages;
      results["RS"] = starred;
      results["TOC"] = topThreeHours;
      results["DOC"] = sortedDays.slice(0, 3).map((day) => day[0]);
      console.log(results);
      let starredSummary = starred.slice(0,3)
      summary = `Your most used languages are ${
        results["MUL"][0] +
        ", " +
        results["MUL"][1] +
        " and " +
        results["MUL"][2]
      }, your most recent starred repositories are ${
        starredSummary[0] + ", " + starredSummary[1] + " and " + starredSummary[2]
      }, your most productive hours are ${
        results["TOC"][0] +
        ", " +
        results["TOC"][1] +
        " and " +
        results["TOC"][2]
      }, your most productive days are ${
        results["DOC"][0] +
        ", " +
        results["DOC"][1] +
        " and " +
        results["DOC"][2]
      }, you have ${results["PRM"]} pull requests merged and you have ${
        results["NOC"]
      } total contributions`;
      document.getElementById("first").children[1].innerHTML =
        topThreeLanguages[0];
      document.getElementById("second").children[1].innerHTML =
        topThreeLanguages[1];
      document.getElementById("third").children[1].innerHTML =
        topThreeLanguages[2];
      for (let i = 0; i < starred.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = `<div class="pls">${starred[i]}</div>`;
        document.getElementById("starred").appendChild(div);
      }
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
});
