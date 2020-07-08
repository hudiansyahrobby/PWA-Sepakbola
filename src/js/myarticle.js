import { getSavedArticleById, getArticleById } from "./api.js";
import { saveForLater } from "./db.js";

document.addEventListener("DOMContentLoaded", function () {
  const materialboxed = document.querySelectorAll(".materialboxed");
  M.Materialbox.init(materialboxed);

  // Grab URL Parameter
  const urlParams = new URLSearchParams(window.location.search);
  // Get Saved Parameter
  const isFromSaved = urlParams.get("saved");
  const btnSave = document.getElementById("save");
  // Check if article was saved in indexed db
  let item = "";
  if (isFromSaved) {
    // Hide button if load from indexed db
    btnSave.style.display = "none";
    // Show the article
    getSavedArticleById();
  } else {
    item = getArticleById();
  }
  btnSave.addEventListener("click", () => {
    item.then((team) => {
      saveForLater(team);
    });
  });
});
