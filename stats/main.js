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
document.addEventListener("DOMContentLoaded", function () {
      const urlParams = new URLSearchParams(window.location.search);
      let username = urlParams.get("username")
      fetch("https://dull-plum-dragonfly-coat.cyclic.app/?username="+username,{
       method:"GET"
      })
              .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    }) .then((data)=>{
      languages = data.MUL
      results["PRM"] = data.PRM
      results["NOC"] = data.NOC
      let sortedHours = data.TOC
      let sortedDays = data.DOC
      let topThreeLanguages = languages
        .slice(0, 3)
      let topThreeHours = sortedHours
        .slice(0, 3)
      results["MUL"] = topThreeLanguages;
      let starred = data.RS
      results["RS"] = starred
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
});
