import {
  getTeamList,
  getSavedArticles,
  getStanding,
  getTopScorer,
} from "./api.js";

export function loadNav() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status !== 200) return;

      // Load Menu List
      const menu = document.querySelectorAll(".nav, .sidenav");
      menu.forEach((elm) => (elm.innerHTML = xhttp.responseText));

      // Add event listener to all the menu
      const menuList = document.querySelectorAll(".sidenav a, .nav a");
      menuList.forEach((elemen) => {
        elemen.addEventListener("click", (event) => {
          // close sidenav
          const sidenav = document.querySelector(".sidenav");
          M.Sidenav.getInstance(sidenav).close();

          // Display page that is called
          let page = event.target.getAttribute("href").substr(1);
          loadPage(page);
        });
      });
    }
  };
  xhttp.open("GET", "./nav.html", true);
  xhttp.send();
}

// load Link in Content
export function loadLink() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    // Check if Request has finished
    if (this.readyState === 4) {
      // Check if Request Succeded
      if (this.status != 200) return;

      // Add event listener to All elemen that has class "link"
      const link = document.querySelectorAll(".link");
      link.forEach((elemen) => {
        elemen.addEventListener("click", (event) => {
          // Display page that is called
          let page = event.target.getAttribute("href").substr(1);
          loadPage(page);
        });
      });
    }
  };
  xhttp.open("GET", "nav.html", true);
  xhttp.send();
}
// Function to load Page
export function loadPage(page) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    // Check if Request has finished
    if (this.readyState === 4) {
      const content = document.querySelector("#body-content");
      // Check if Request Succeded
      if (this.status === 200) {
        content.innerHTML = xhttp.responseText;
        // Call Function based on page URL
        if (page === "home") {
          getTeamList();
        } else if (page === "saved") {
          getSavedArticles();
        } else if (page === "standing") {
          getStanding();
        } else if (page === "topscore") {
          getTopScorer();
        }
        loadLink();
      } else if (this.status === 404) {
        content.innerHTML = "<p>404 Not Found</p>";
      } else {
        content.innerHTML = "<p>This page is forbidden</p>";
      }
    }
  };
  xhttp.open("GET", "pages/" + page + ".html", true);
  xhttp.send();
}
