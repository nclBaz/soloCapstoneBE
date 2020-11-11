const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const validator = require("validator");

const companySchema = new Schema(
  {
    jobPosition: {
      type: String,
      // required: true,
      // minlength: [4, "Company  name should be at least 4 character"],
    },

    salary: {
      type: String,
      default: "Not specified.",
    },
    type: {
      type: String,
    },

    jobDescription: {
      type: String,
      required: true,
      minlength: [4, "surname should be at least 4 character"],
    },
    image: {
      type: String,
    },
    userID: {
      type: String,
    },
    companyName: {
      type: String,
    },
    location: {
      type: String,
    },
    requirments: {
      type: String,
    },

    benefites: {
      type: String,
    },

    allAplication: [{ type: Schema.Types.ObjectId, ref: "workersprofile" }],
  },
  { timestamps: true }
);

const Model = mongoose.model("companyposts", companySchema);
module.exports = Model;
