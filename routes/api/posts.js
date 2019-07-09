const express = require("express");
const router = express.Router();

router.use(express.json());

const Posts = require("../../data/db");

router.post("/", (req, res) => {
  const data = req.body;

  if (data.title && data.contents) {
    Posts.insert(data)
      .then(posts => {
        res.status(201).json(posts);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.post_id = id;

  Posts.findById(id).then(post => {
    if (post.length < 1) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      if (!data.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        Posts.insertComment(data)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      }
    }
  });
});

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then(post => {
      if (post.length < 1) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then(comments => {
      if (comments.length < 1) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(post => {
      if (post.length < 1) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json({ message: "Successfully deleted that post" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (data.title && data.contents) {
    Posts.update(id, data)
      .then(post => {
        if (post.length < 1) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

module.exports = router;
