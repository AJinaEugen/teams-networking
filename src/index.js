import "./style.css";

console.log("start");

function getTeamAsHtml(team) {
  return `<tr>
              <td><input type="checkbox" name="" id="" /></td>
              <td>${team.promotion}</td>
              <td>${team.members}</td>
              <td>${team.name}Native</td>
              <td>${team.url}</td>
              <td>X</td>
            </tr>`;
}

function renderTeams(teams) {
  const htmlTeams = teams.map(getTeamAsHtml);
  const table = document.querySelector("tbody");
  table.innerHTML = htmlTeams.join("");
}

function loadTeams() {
  fetch("teams.json")
    .then(r => r.json())
    .then(renderTeams);
}

loadTeams();
