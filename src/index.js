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
              <td>
              <a data-set=${team.id} class="delete-btn">🧨</a>
              <a data-set=${team.di}class="edit-btn">&#9998</a>
              </td>
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
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function deleteTeam(id) {
  // DELETE teams-json/delete
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
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
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      deleteTeam(e.target.getAttribute("data-set"));
    }
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.edit-btn")) {
      console.log("edit");
    }
  });
}

loadTeams();
initEvent();
