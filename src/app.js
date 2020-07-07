"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const { getChart } = require("billboard-top-100/billboard-top-100");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

let newCharts;

function handleBillboardCharts(req, res) {
  let chartType = "hot-100";
  let chartDate = req.query.date;
  
  console.log("date is", req.query.date);
  

  getChart(chartType, chartDate, (err, chart) => {
    if (err) {
      res.send(err);
    } else {
      newCharts = chart.songs.map(entry => {
        return {
          id: entry.rank,
          title: entry.title,
          artist: entry.artist
        };
      });
      console.log("The top song is SWV watch", newCharts[0]);
    }
  });

  res
    .status(200)
    .json(newCharts)
    .end();
}

// function getChart("hot-100", "1993-07-10", (err, chart) => {
//   if (err) console.log(err);
//   newCharts = chart.songs;
//   console.log("The top song is SWV watch:", newCharts[0]);
// });

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/charts", handleBillboardCharts);

module.exports = app;
