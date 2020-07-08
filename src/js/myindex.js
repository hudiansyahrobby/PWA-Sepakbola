import { loadNav, loadPage } from "./script.js";

const loadingPage = () => {
  // Load page content
  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);
};

document.addEventListener("DOMContentLoaded", () => {
  // Function for Loading the Navigation Bar
  const sideNav = document.querySelectorAll(".sidenav");
  const materialboxed = document.querySelectorAll(".materialboxed");
  // Initialize Materialbox
  M.Materialbox.init(materialboxed);
  // Initialize sideNav and load nav
  M.Sidenav.init(sideNav);
  // Load Nav and Page Content
  loadNav();
  loadingPage();
});

// Load Page Content when hash change
window.addEventListener("hashchange", () => {
  // Load Page Content
  loadingPage();
});
