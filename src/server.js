const express = require('express')
const fs = require("fs")
const path = require("path")

const app = express()

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.get("/video", (req, res) => {
  const range = req.headers.range
  
  if (!range) {
    return res.status(400).send("Range parametr is missing.")
  }

  const pathToVideo = __dirname + '/videos/mood.mp4'
  const sizeOfVideo = fs.statSync(pathToVideo).size
  const CHUNK_SIZE = 10_000
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + CHUNK_SIZE, sizeOfVideo - 1)
  const contentLength = end - start + 1
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${sizeOfVideo}`,
    "Accept-Range": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }

  res.writeHead(206, headers)

  const videoStream = fs.createReadStream(pathToVideo, { start, end })
  videoStream.pipe(res);
})

app.listen(3000, () => console.log(`server is listening on *${3000} PORT`))