const express = require("express");
const postSchema = require("../post/schema");
const aplicationSchema = require("../../workes/aplication/schema");
const { User } = require("../Midlewares/middleware");
const workerProfile = require("../../workes/profile/schema");
const manageAplication = express.Router();
const sgMail = require("@sendgrid/mail");

manageAplication.get("/allPost", User, async (req, res, next) => {
  try {
    const allPost = await postSchema
      .find({ userID: req.user._id })
      .populate("allAplication");
    res.send(allPost);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

manageAplication.post(
  "/:postId/accept/:workerid",
  User,
  async (req, res, next) => {
    try {
      const userID = req.params.workerid;
      const postID = req.params.postId;
      const accept = "accepted";
      const sendPost = await aplicationSchema.findOneAndUpdate({
        userId: userID,
        postId: postID,
        answer: accept,
      });
      const removeAplication = await postSchema.find({
        _id: postID,
        allAplication: userID,
      });
      removeAplication.pop(userID);
      removeAplication.save();
      if (removeAplication) {
        res.send("removed");
      }
      res.send(sendPost);
    } catch (err) {
      next(err);
      console.log(err);
    }
  }
);
manageAplication.post(
  "/:postId/accept/:workerid",
  User,
  async (req, res, next) => {
    try {
      const userID = req.params.workerid;
      const postID = req.params.postId;
      const accept = "not accepted";
      const sendPost = await aplicationSchema.findOneAndUpdate({
        userId: userID,
        postId: postID,
        answer: accept,
      });
      const removeAplication = await postSchema.find({
        _id: postID,
        allAplication: userID,
      });
      removeAplication.pop(userID);
      removeAplication.save();

      res.send(sendPost);
    } catch (err) {
      next(err);
      console.log(err);
    }
  }
);
manageAplication.post("/sendEmail/:workerId", User, async (req, res, next) => {
  try {
    sendEmail.setApiKey(process.env.API_KEY_SENDGRID);
    const _id = req.params.workerId;
    const user = req.user;
    const worker = await workerProfile.findById({ _id: _id });
    console.log(req.body, "hellooooooodfgdfhdf");
    const msg = {
      to: worker.email,
      from: "TechJobs@email.com",
      subject: `${req.body.subject} + Contact to this email for more details  ${user.email}`,
      text: req.body.text,
    };

    sendEmail.send(msg);
    res.send("sent");
  } catch (error) {
    next(error);
    console.log(error);
  }
});
// manageAplication.post("/send/question", async (req, res, next) => {
//   try {
//     sgMail.setApiKey(process.env.API_KEY_SENDGRID);
//     sgMail.send({
//       to: `aleksandergjoni125@gmail.com`,
//       from: `TechJobs@email.com`,
//       subject: `Questions Team`,
//       text: `thanks for contacting us. We will send you an answer ASAP! YOLO TEA`,
//     });

//     res.status(201).send("Sent");
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

manageAplication.post(
  "/:postId/sendEmail/:workerId",
  User,
  async (req, res, next) => {
    try {
      sendEmail.setApiKey(process.env.API_KEY_SENDGRID);
      const _id = req.params.workerId;
      const postId = req.params.postId;
      const user = req.user;
      const worker = await workerProfile.findById({ _id: _id });

      const aplication = await aplicationSchema.findOne({
        userId: _id,
        postId: postId,
      });
      if (aplication.answer === "accepted") {
        const msg = {
          to: worker.email,
          from: user.email,
          subject: "Hello from our company" + worker.companyName,
          text:
            "We want to inform you that you have ben accepted for interview in our company",
        };

        await sendEmail.send(msg);
        res.send("sent");
      } else if (aplication.answer === "not accepted") {
        const msg = {
          to: worker.email,
          from: user.email,
          subject: "Hello from our company" + worker.companyName,
          text:
            "We want to inform you that you have  not  ben accepted for interview in our company",
        };

        await sendEmail.send(msg);
        res.send("sent");
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
);

module.exports = manageAplication;
