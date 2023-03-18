const axios = require("axios");
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 8010;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "proxy api server running..", status: 200 });
});

const allowedRequestMethods = ["GET", "POST"];

const getResponseWithAxios = async ({ url, method, payload }) => {
  try {
    const response = await axios({
      method,
      url,
      data: payload,
    });
    const { data, status } = response;

    return { data, status };
  } catch (error) {
    const { response } = error;
    const { data, status } = response;

    return { data, status };
  }
};

app.post("/request", async (req, res) => {
  try {
    const { url, method, payload } = req.body;
    if (!url || !method) {
      return res.status(400).json({
        message: "both request method and url is required",
        status: 400,
      });
    }
    const isValidRequestMethod = allowedRequestMethods.includes(
      method.toUpperCase()
    );
    if (!isValidRequestMethod) {
      return res.status(400).json({
        message: "invalid request method type",
        status: 400,
      });
    }

    const response = await getResponseWithAxios({ url, method, payload });

    return res.status(200).json({ response, status: 200 });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
});

app.listen(port, () => {
  console.log(`proxy api server listening on port ${port}`);
});
