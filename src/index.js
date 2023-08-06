import "./style.css";
// Feature flag
console.log("start");

let activePage = 1;

(function () {
  location.hash = activePage;
  const hash = document.location.hash;
  if (hash) {
    const link = $("#pagination");

    if (link) {
      location.hash = activePage;
    }
  }
})();

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
              <td ><a href=# >${team.url}</a></td>
              <td>
               <button type="button" data-id=${team.id} class="delete-btn" title="delete">🗑</button>
              <button type="button" data-id=${team.id} class="edit-btn" title="edit">  🖍</button>
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

function renderTeams(teams, editId, pagenumber) {
  const htmlTeams = teams.map(team => {
    return team.id === editId ? getTeamAsHtmlInput(team) : getTeamAsHtml(team);
  });

  const pages = htmlTeams.length / 5;
  const pagination = document.querySelector(".pagination");
  const arrayOfPages = [];
  for (let i = 0; i < pages; i++) {
    arrayOfPages.push(`<div class="numberElement" >${i + 1}</div>`);
  }
  pagination.innerHTML = arrayOfPages.join("");

  const paginatedTeam = doPagination(htmlTeams, pagenumber);

  const table = document.querySelector("tbody");
  table.innerHTML = paginatedTeam.join("");
}

function doPagination(team, pageNumber) {
  const paginatedTeam = [];
  let start;

  for (start = pageNumber * 5 - 5; start < pageNumber * 5; start++) {
    if (team[start]) {
      paginatedTeam.push(team[start]);
    } else {
      console.log("undefined");
    }
  }

  return paginatedTeam;
}

function loadTeams(pageNumber) {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      renderTeams(allTeams, editId, pageNumber);
      setInputDisabled(false);
      editId = null;
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
  renderTeams(allTeams, editId, activePage);
  setInputDisabled(true);
}

function filterElements(teams, search) {
  search = search.toLowerCase();
  return teams.filter(team => {
    return (
      team.promotion.toLowerCase().includes(search) ||
      team.members.toLowerCase().includes(search) ||
      team.name.toLowerCase().includes(search) ||
      team.url.toLowerCase().includes(search)
    );
  });
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
        editId = null;
        loadTeams(activePage);
      }
    });
  } else {
    createTeams(team).then(status => {
      if (status.success) {
        loadTeams(activePage);
      }
    });
  }
}
function initEvent() {
  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", e => {
    if (editId) {
      let pageNumber = activePage;
      loadTeams(pageNumber);
    } else {
      loadTeams(activePage);
    }
  });
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("button.delete-btn")) {
      deleteTeam(e.target.dataset.id).then(status => {
        if (status.success) {
          loadTeams(activePage);
        }
      });
    } else if (e.target.matches("button.edit-btn")) {
      startEdit(e.target.dataset.id);
    }
  });
  $("#searchField").addEventListener("input", e => {
    const teams = filterElements(allTeams, e.target.value);
    renderTeams(teams);
  });

  $("#pagination").addEventListener("click", e => {
    if (e.target.matches(".numberElement")) {
      let pageNumber = parseInt(e.target.innerHTML);

      loadTeams(pageNumber);
      activePage = pageNumber;
      location.hash = pageNumber;
    }
  });
}

loadTeams(activePage);
initEvent();
