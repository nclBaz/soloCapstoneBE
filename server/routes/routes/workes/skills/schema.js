const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const schema = new Schema(
  {
    skillName: {
      type: String,
      required: true,
    },
    profileId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("skills", schema);
module.exports = Model;
