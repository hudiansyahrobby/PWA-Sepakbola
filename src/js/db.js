import idb from "./idb.js";

// Create Database,
export const dbPromised = idb.open("club-reader", 1, function (upgradeDb) {
  // Create Object Store
  const teamObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id",
  });
  // Create Index
  teamObjectStore.createIndex("team", "team", {
    unique: false,
  });
});

// Save team to db
export function saveForLater(article) {
  dbPromised
    .then((db) => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.put(article);
      return tx.complete;
    })
    .then(() => {
      M.toast({
        html: "Saved!",
        classes: "rounded blue",
      });
    });
}

// Get All saved Teams article From db
export function getAll() {
  return new Promise((resolve) => {
    dbPromised
      .then((db) => {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.getAll();
      })
      .then((teams) => {
        resolve(teams);
      });
  });
}
