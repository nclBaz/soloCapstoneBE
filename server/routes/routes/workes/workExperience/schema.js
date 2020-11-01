const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const schema = new Schema(
  {
    workExperience: {
      type: String,
      required: true,
    },
    workPosition: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      minlength: [2, "Text should be at least 2 character long"],
    },
    started: {
      type: String,
    },
    finished: {
      type: String,
    },
    image: {
      type: String,
    },
    profileId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("workExperience", schema);
module.exports = Model;
