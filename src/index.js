import "./style.css";

console.log("start");

let allTeams = [];
let editId;

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
               <a data-id=${team.id} class="delete-btn" title="delete">🗑</a>
              <a data-id=${team.id} class="edit-btn" title="edit">  🖍</a>
              </td>
            </tr>`;
}

function getTeamAsHtmlInput(team) {
  return `<tr>
             <td></td>
                <td><input value="${team.promotion}" type="input" name="promotion" id="promotion" placeholder="Enter promotion" required /></td>
                <td><input value="${team.members}" type="input" name="members" id="members" placeholder="Enter members" required /></td>
                <td><input value="${team.name}" type="input" name="name" id="teamName" placeholder="Enter name" required /></td>
                <td><input value="${team.url}" type="input" name="url" id="url" placeholder="Enter url" required /></td>
                <td>
              <a data-id=${team.id} class="Save" title="Save me">💾</a>
              <a data-id=${team.id} class="Cancel" title="Cancel"> ⛔</a>
                </td>
            </tr>`;
}

function renderTeams(teams, editId) {
  const htmlTeams = teams.map(team => {
    return team.id === editId ? getTeamAsHtmlInput(team) : getTeamAsHtml(team);
  });
  const table = document.querySelector("tbody");
  table.innerHTML = htmlTeams.join("");
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      renderTeams(teams);
    });
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

function startEdit(id) {
  editId = id;
  renderTeams(allTeams, editId);
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
  createTeams(team).then(status => {
    if (status.success) {
      window.location.reload();
    }
  });
}
function initEvent() {
  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      deleteTeam(e.target.dataset.id).then(status => {
        if (status.success) {
          window.location.reload();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      $("#teamsTable tbody").addEventListener("click", e => {
        startEdit(e.target.dataset.id);
      });
    }
  });
}

loadTeams();
initEvent();
