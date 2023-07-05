import "./style.css";

console.log("start");

function $(element) {
  return document.querySelector(element);
}

function getTeamAsHtml(team) {
  return `<tr>
              <td><input type="checkbox" name="" id="" /></td>
              <td>${team.promotion}</td>
              <td>${team.members}</td>
              <td>${team.name}</td>
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
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(renderTeams);
}

function createTeams(team) {
  //   POST teams-json/create
  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
}

function onSubmit(entry) {
  entry.preventDefault();

  const promotion = $("#promotion").value;
  const member = $("#members").value;
  const teamName = $("#teamName").value;
  const url = $("#url").value;

  const team = {
    promotion: promotion,
    members: member,
    name: teamName,
    url: url
  };
  console.log(team);
  createTeams(team);
}
function initEvent() {
  $("#teamsForm").addEventListener("submit", onSubmit);
}
loadTeams();
initEvent();
