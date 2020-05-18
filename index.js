const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
//app.use(bodyParser.raw());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
let filename;
app.post("/", (req, res) => {
  let html = req.body.html || "Nothing";
  filename = req.body.filename || "default.pdf";

  async function Conversion() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      path: filename,
      format: "A4",
      margin: {
        top: "1cm",
        bottom: "1cm",
        right: "1cm",
        left: "1cm",
      },
      printBackground: true,
    });
    res.sendStatus(200)
    browser.close();
  }
  try{
    Conversion();
  }
  catch(e){
    console.log(e)
    res.sendStatus(400)
  }
});

app.get("/download", (req, res) => {
  console.log("filename", filename);
  res.download(__dirname + "/" + filename, filename, (err) => {
    if (err) console.log(err);
    else console.log("done");
  });
});
app.listen(3000, () => console.log("Listening at 3000"));
