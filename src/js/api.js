import { getAll, dbPromised } from "./db.js";
import axios from "axios";

const base_url = "https://api.football-data.org/";
const AUTH_TOKEN = "c408a236b327439db60417d8d11e5320";

// Card Element
const card = (team) =>
  `
        <div data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-in-out" class="col s12 m6 l4">
          <div class="card hoverable">
            <div class="card-image">
              <img class="materialboxed" src=${team.crestUrl} alt=${team.name}>
            </div>
            <div class="card-content text-bold black-text center-align">
            <h2 class="truncate">${team.name}</h2>
              <p class="truncate">${team.venue}</p>
            </div>
            <img class="image-absolute" src="./assets/images/icons/ball.png" />
            <a class="btn blue" href="./article.html?id=${team.id}">See Details</a>
          </div>
        </div>`;

// Standing or Klasemen Elemen
const klasemen = (t) =>
  `
<tr data-aos="fade-in">
  <td>${t.position}</td>
  <td><img class="icon-club" src=${t.team.crestUrl} /></td>
  <td>${t.team.name}</td>
  <td>${t.playedGames}</td>
  <td>${t.won}</td>
  <td>${t.draw}</td>
  <td>${t.lost}</td>
  <td>${t.goalsFor}</td>
  <td>${t.goalsAgainst}</td>
  <td>${t.goalDifference}</td>
  <td>${t.points}</td>
</tr>


`;

// Top Scorer Element
const topScorer = (top, index) => `
<tr data-aos="fade-in">
  <td>${index + 1}</td>
  <td>${top.player.name}</td>
  <td>${top.team.name}</td>
  <td>${top.numberOfGoals}</td>
  <td><img src="./assets/images/icons/ball.png" /></td>
</tr>
`;

// Detail Team Element
const teamDetail = (detail) => `

    <div class="col s12 l6 center-align" >
      <a href=${detail.website}>
        <img src=${detail.crestUrl} alt=${detail.name} data-aos="slide-right"/>
      </a>
    </div>

    <div class="col s12 l6" >
      <ul class="collection" data-aos="slide-left">
          <li class="collection-item">
            <div>${detail.name}</a>
            </div>
          </li>

          <li class="collection-item">
            <div>${detail.venue}</a>
            </div>
          </li>

          <li class="collection-item">
            <div>Est. ${detail.founded}</a>
            </div>
          </li>

          <li class="collection-item">
            <div>${detail.email ? detail.email : "Email Address is Unknown"}</a>
            </div>
          </li>

          <li class="collection-item">
            <div>${detail.phone ? detail.phone : "Phone Number is Unknown"}</a>
            </div>
          </li>

          <li class="collection-item">
            <div>${detail.address}</a>
            </div>
          </li>

      </ul>
    </div>
`;

// Saved Team Element
const savedTeam = (team) =>
  `
  <div class="col s12 m6 l4" data-aos="fade-up" data-aos-duration="800">
    <div class="card hoverable">
      <div class="card-image">
        <img class="materialboxed" src=${team.crestUrl} alt=${team.name}>
      </div>
      <div class="card-content text-bold black-text center-align">
      <h2 class="truncate">${team.name}</h2>
        <p class="truncate">${team.venue}</p>
      </div>
      <img class="image-absolute" src="./assets/images/icons/ball.png" />
      <a class="btn blue" href="./article.html?id=${team.id}&saved=true">View</a>
      <a id="closed" data-id=${team.id} class="btn red">Delete</a>
    </div>
  </div>`;

// Player List Element
const playerList = (player) => {
  // Check If he's a player or a coach
  if (player.position) {
    // Player Element
    return `<div class="col s12 m6 l4 xl3" data-aos="fade-up data-aos-duration="600">
            <div class="card-panel white">
              <h3 class="truncate">${player.name}</h3>
              <p>${player.position}</p>
              <p>${player.nationality}</p>
              <img class="image-absolute" src="./assets/images/icons/ball.png" />
            </div>
          </div>`;
  } else {
    // Coach Element
    return `<div class="col s12 m6 l4 xl3" data-aos="fade-up data-aos-duration="600">
              <div class="card-panel white">
                <h3 class="truncate">${player.name}</h3>
                <p>${player.role}</p>
                <p>${player.nationality}</p>
                <img class="image-absolute" src="./assets/images/icons/ball.png" />
              </div>
            </div>`;
  }
};

function getSavedArticles() {
  let articlesHTML = "";
  getAll()
    .then((articles) => {
      // Show "You don't have favorite team yet" if articles is empty
      if (articles.length === 0) {
        articlesHTML = `<h2 class="text-grey center-align">You Don't Have Favorite Teams Yet</h2>`;
        document.querySelector("#saved-team .row").innerHTML = articlesHTML;
      } else {
        articles.forEach((article) => {
          articlesHTML += savedTeam(article);
        });
        document.querySelector("#saved-team .row").innerHTML = articlesHTML;
        document.addEventListener("click", function (e) {
          if (e.target && e.target.id == "closed") {
            // Get Id Team
            const id = e.target.dataset.id;
            // Delete Team By ID
            deleteById(id);
            // Reload Page after delete Team
            location.reload();
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// Get Axios to API Endpoint
function getAxios(url) {
  return axios.get(`${base_url}${url}`, {
    headers: {
      "X-Auth-Token": AUTH_TOKEN,
      "content-type": "application/json",
    },
  });
}

// Function to Get Team
function getTeamList() {
  if ("caches" in window) {
    caches.match(`${base_url}v2/competitions/2021/teams`).then((response) => {
      if (response) {
        response.json().then((data) => {
          let teamContainer = "";
          data.teams.forEach((team) => {
            teamContainer += card(team);
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.querySelector("#teams .row").innerHTML = teamContainer;
        });
      } else {
        getAxios("v2/competitions/2021/teams")
          .then((res) => {
            let teamContainer = "";
            res.data.teams.forEach((team) => {
              teamContainer += card(team);
            });
            document.querySelector("#teams .row").innerHTML = teamContainer;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
}

// Get Article by Id Function
const getArticleById = () => {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    let teamDetailContainer = "";

    if ("caches" in window) {
      caches.match(`${base_url}v2/teams/${idParam}`).then((response) => {
        if (response) {
          response.json().then((data) => {
            let playerContainer = "";
            teamDetailContainer = teamDetail(data);
            data.squad.forEach((player) => {
              playerContainer += playerList(player);
            });
            document.querySelector("#squad .row").innerHTML = playerContainer;
            document.querySelector(
              "#body-content .row"
            ).innerHTML = teamDetailContainer;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        } else {
          getAxios("v2/teams/" + idParam).then((res) => {
            let playerContainer = "";
            teamDetailContainer += teamDetail(res.data);
            res.data.squad.forEach((player) => {
              playerContainer += playerList(player);
            });

            // Insert playContainer and teamDetailContainer to .row
            document.querySelector("#squad .row").innerHTML = playerContainer;
            document.querySelector(
              "#body-content .row"
            ).innerHTML = teamDetailContainer;
            resolve(res.data);
          });
        }
      });
    }
  });
};

// Function to Get Standing Content
const getStanding = () => {
  if ("caches" in window) {
    caches
      .match(`${base_url}v2/competitions/2021/standings`)
      .then((response) => {
        if (response) {
          response.json().then((data) => {
            let standingContainer = "";
            data.standings[0].table.forEach((standing) => {
              standingContainer += klasemen(standing);
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.querySelector(
              "#standing tbody"
            ).innerHTML = standingContainer;
          });
        } else {
          getAxios("v2/competitions/2021/standings")
            .then((res) => {
              let standingContainer = "";
              res.data.standings[0].table.forEach((standing) => {
                standingContainer += klasemen(standing);
              });
              document.querySelector(
                "#standing tbody"
              ).innerHTML = standingContainer;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }
};

// Function to Get Top Scorer Content
const getTopScorer = () => {
  if ("caches" in window) {
    caches.match(`${base_url}v2/competitions/2021/scorers`).then((response) => {
      if (response) {
        response.json().then((data) => {
          let topContainer = "";
          data.scorers.forEach((dt, index) => {
            topContainer += topScorer(dt, index);
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.querySelector("#topscorer tbody").innerHTML = topContainer;
        });
      } else {
        getAxios("v2/competitions/2021/scorers")
          .then((res) => {
            let topContainer = "";
            res.data.scorers.forEach((top, index) => {
              topContainer += topScorer(top, index);
            });
            document.querySelector("#topscorer tbody").innerHTML = topContainer;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
};

// Function to Get Saved Articles in db

function getSavedArticleById() {
  // Get id Parameter
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  // Get article by Id
  getById(idParam).then(function (article) {
    let articleHTML = "";
    let playerContainer = "";
    articleHTML += teamDetail(article);
    article.squad.forEach((player) => {
      playerContainer += playerList(player);
    });
    document.querySelector("#squad .row").innerHTML = playerContainer;
    document.querySelector("#body-content .row").innerHTML = articleHTML;
  });
}

function getById(id) {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.get(+id);
      })
      .catch((err) => {
        console.log(err);
      })
      .then((article) => {
        resolve(article);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function deleteById(id) {
  dbPromised
    .then(function (db) {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.delete(+id);
      return tx.complete;
    })
    .then(function () {
      console.log("Item deleted");
    });
}

export {
  getSavedArticles,
  getTeamList,
  getArticleById,
  getStanding,
  getTopScorer,
  getSavedArticleById,
};
