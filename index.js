// create an express app
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));

// use the express-static middleware
app.use(express());

// define the first route
app.get("/shows", function (req, res) {
    let page = req.query.page || 1;

    page = page == 1 ? parseInt(page) : parseInt(page) * 2;
    let url = "https://akwam.to/shows?page=" + page;

    request(url, function (error, response, html) {
        let shows = [];
        if (!error) {
            var $ = cheerio.load(html);
            data = $(".widget-body").html();
            $(".widget-body")
                .children()
                .each(function (index, item) {
                    let link = $(item)
                        .children("div")
                        .children(".entry-body")
                        .children("h3")
                        .children("a")
                        .attr("href");
                    let title = $(item)
                        .children("div")
                        .children(".entry-body")
                        .children("h3")
                        .children("a")
                        .text();
                    let image = $(item)
                        .children("div")
                        .children(".entry-image")
                        .children("a")
                        .children("picture")
                        .children("img")
                        .attr("data-src");

                    if (title.includes("Smackdown"))
                        title = title.replace("Friday Night ", "");
                    if (title.includes("Raw"))
                        title = title.replace("Monday Night ", "");

                    let imgBase = "https://borturad.sirv.com/watchwrestling/";
                    if (title.includes("Raw")) image = imgBase + "raw.jpg";
                    if (title.includes("Smackdown"))
                        image = imgBase + "smackdown.jpg";
                    if (title.includes("NXT")) image = imgBase + "nxt.jpg";
                    if (title.includes("Dynamite"))
                        image = imgBase + "dynamite.jpg";
                    if (title.includes("Rampage"))
                        image = imgBase + "rampage.jpg";

                    if (title.includes("WWE") || title.includes("AEW")) {
                        shows.push({
                            title: title,
                            image: image,
                            link: link,
                        });
                    }
                });
            url = "https://akwam.to/shows?page=" + (page + 1);
            request(url, function (error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);
                    data = $(".widget-body").html();
                    $(".widget-body")
                        .children()
                        .each(function (index, item) {
                            let link = $(item)
                                .children("div")
                                .children(".entry-body")
                                .children("h3")
                                .children("a")
                                .attr("href");
                            let title = $(item)
                                .children("div")
                                .children(".entry-body")
                                .children("h3")
                                .children("a")
                                .text();
                            let image = $(item)
                                .children("div")
                                .children(".entry-image")
                                .children("a")
                                .children("picture")
                                .children("img")
                                .attr("data-src");
                            if (title.includes("Smackdown"))
                                title = title.replace("Friday Night ", "");
                            if (title.includes("Raw"))
                                title = title.replace("Monday Night ", "");

                            let imgBase =
                                "https://borturad.sirv.com/watchwrestling/";
                            if (title.includes("Raw"))
                                image = imgBase + "raw.jpg";
                            if (title.includes("Smackdown"))
                                image = imgBase + "smackdown.jpg";
                            if (title.includes("NXT"))
                                image = imgBase + "nxt.jpg";
                            if (title.includes("Dynamite"))
                                image = imgBase + "dynamite.jpg";
                            if (title.includes("Rampage"))
                                image = imgBase + "rampage.jpg";

                            if (
                                title.includes("WWE") ||
                                title.includes("AEW")
                            ) {
                                shows.push({
                                    title: title,
                                    image: image,
                                    link: link,
                                });
                            }
                        });
                    res.send(shows);
                }
            });
        }
    });
});
//document.querySelector("#show-episodes > div > div > div:nth-child(5) > div > div > a")

app.get("/watch", (req, res) => {
    let url = req.query.v.replaceAll(" ", "%20") || "";
    let src = url;
    if (src.includes("nxt")) {
        src = src
            .replace(/[0-9]/g, "")
            .replace("https://akwam.to/shows/", "")
            .replace("/wwe-nxt", "");
        url = url.replace(src[0], "%20");
    }

    console.log("Video Process Started");
    //Getting the url shortner page
    request(url, function (error, response, html) {
        let shows = [];
        if (!error) {
            console.log("1/3");
            var $ = cheerio.load(html);
            let link = $(".link-show").attr("href");
            /* This link can be empty if the page has multiple shows so
			I have to call another function here if it returns empty */

            /****** GETTING VIDEO PAGE STARTS *******/
            request(link, function (error, response, html) {
                let shows = [];
                if (!error) {
                    var $ = cheerio.load(html);
                    let videopagelink = $(".download-link").attr("href");
                    console.log("2/3");

                    /****** GETTING VIDEO LINK STARTS *******/
                    request(videopagelink, function (error, response, html) {
                        let shows = [];
                        if (!error) {
                            var $ = cheerio.load(html);
                            let videosLinks = [];
                            $("video")
                                .children()
                                .each(function (index, item) {
                                    let link = $(item).attr("src");
                                    let size = $(item).attr("size");
                                    videosLinks.push({
                                        size: size,
                                        link: link,
                                    });
                                });
                            console.log("3/3");
                            res.send({
                                videos: videosLinks,
                            });
                        }
                    });
                    /****** GETTING VIDEO LINK ENDS *******/
                }
            });

            /****** GETTING VIDEO PAGE ENDS *******/
        } else {
            res.send(hehe);
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});

app.get("/:file", (req, res) => {
    let reqFile = req.params.file;
    res.sendFile(__dirname + "/frontend/" + reqFile);
});

// start the server listening for requests
app.listen(process.env.PORT || 9000, () => {
    console.clear();
    console.log("Server is running...");
});
