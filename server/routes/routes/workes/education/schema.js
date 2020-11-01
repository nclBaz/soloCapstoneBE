const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const schema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      // required:true
    },
    image: {
      type: String,
    },
    endDate: {
      type: String,
    },
    about: {
      type: String,
      required: true,
    },
    skillsLearned: {
      type: String,
    },
    profileId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("education", schema);
module.exports = Model;
