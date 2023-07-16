import "./style.css";
// Feature flag
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
                <td><input value="${team.promotion}" type="input" name="promotion" id="promotion" placeholder="Enter promotion" required  /></td>
                <td><input value="${team.members}" type="input" name="members" id="members" placeholder="Enter members" required  /></td>
                <td><input value="${team.name}" type="input" name="name" id="teamName" placeholder="Enter name" required /></td>
                <td><input value="${team.url}" type="input" name="url" id="url" placeholder="Enter url" required /></td>
                <td>
                    <button type="submit" title="Save"> 💾 </button> 
                    <button type="reset" title="Cancel"> ⛔ </button>
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
      setInputDisabled(false);
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

function updateTeam(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => {
    return r.json();
  });
}

function setInputDisabled(disabled) {
  document.querySelectorAll("tfoot input").forEach(input => {
    input.disabled = disabled;
    console.log(input);
    input.value = "";
  });
}

function startEdit(id) {
  editId = id;
  renderTeams(allTeams, editId);
  setInputDisabled(true);
}

function getTeamValues(parent) {
  const promotion = $(`${parent} input[name=promotion]`).value;
  const member = $(`${parent} input[name=members ]`).value;
  const teamName = $(`${parent} input[name=name]`).value;
  const url = $(`${parent} input[name=url]`).value;

  const team = {
    promotion: promotion,
    members: member,
    name: teamName,
    url: url
  };
  return team;
}

function onSubmit(entry) {
  entry.preventDefault();

  const team = getTeamValues(editId ? "tbody" : "tfoot");

  if (editId) {
    team.id = editId;
    updateTeam(team).then(status => {
      if (status.success) {
        console.log(status);
        loadTeams();
      }
    });
  } else {
    createTeams(team).then(status => {
      if (status.success) {
        loadTeams();
      }
    });
  }
}
function initEvent() {
  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", e => {
    if (editId) {
      loadTeams();
    }
  });
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      deleteTeam(e.target.dataset.id).then(status => {
        if (status.success) {
          loadTeams();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      startEdit(e.target.dataset.id);
    }
  });
}

loadTeams();
initEvent();
