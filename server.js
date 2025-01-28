const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Postavi statički direktorij
app.use(express.static(path.join(__dirname, "public")));

// Za sve ostale rute, posluži `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
