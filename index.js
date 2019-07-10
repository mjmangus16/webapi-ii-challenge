const express = require("express");

const server = express();

const posts = require("./routes/api/posts");

server.use("/api/posts", posts);

server.listen(5000, () => console.log("Server running on port 5000"));
