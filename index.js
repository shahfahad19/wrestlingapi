
// create an express app
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
app.use(cors({origin: "*"}));

// use the express-static middleware
app.use(express());

//routing

app.get("/shows", (req, res) => {
	let page = req.query.page || "1";
	page = parseInt(page) * 2;
	console.log(page);
	let url =
		"https://akwam.to/shows?page="+page

	request(url, function (error, response, html) {
		let shows = [];
		if (!error) {
			var $ = cheerio.load(html);
			data = $(".widget-body").html();
			$(".widget-body")
				.children()
				.each(function (index, item) {
					let link = $(item).children("div").children(".entry-body").children("h3").children("a").attr("href");
					let title = $(item).children("div").children(".entry-body").children("h3").children("a").text();
					let image = $(item).children("div").children(".entry-image").children("a").children("picture").children("img").attr("data-src");
					title = title.includes("Smackdown") ? title.replace("Friday ", "").replace("Night ", "") : title;
					title = title.includes("Raw") ? title.replace("Monday ", "").replace("Night ", "") : title;

					if(title.includes("WWE") || title.includes("AEW")) {
						shows.push({
							title: title,
							image: image,
							link: link
						})
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
							let link = $(item).children("div").children(".entry-body").children("h3").children("a").attr("href");
							let title = $(item).children("div").children(".entry-body").children("h3").children("a").text();
							let image = $(item).children("div").children(".entry-image").children("a").children("picture").children("img").attr("data-src");
							title = title.includes("Smackdown") ? title.replace("Friday ", "").replace("Night ", "") : title;
							title = title.includes("Raw") ? title.replace("Monday ", "").replace("Night ", "") : title;

							if (title.includes("WWE") || title.includes("AEW")) {
								shows.push({
									title: title,
									image: image,
									link: link
								})
							}
						});
					res.send(shows);
					
				}
			});
		}
	});
});
//document.querySelector("#show-episodes > div > div > div:nth-child(5) > div > div > a")

app.get("/videos", (req, res) => {
	let url = req.query.url.replaceAll(" ", "%20") || "";
	let src = url;
	if (src.includes("nxt")){
		src = src.replace(/[0-9]/g, ''). replace('https://akwam.to/shows/', '').replace("/wwe-nxt", "");
		url = url.replace(src[0], "%20"); 
	}

	console.log(url);
	//Getting the url shortner page
	request(url, function (error, response, html) {
		let shows = [];
		if (!error) {
			var $ = cheerio.load(html);
			let link = $(".link-show").attr("href");

			console.log("1/3");
			//Getting Video Page
			console.log(link);
			request(link, function (error, response, html) {
				let shows = [];
				if (!error) {
					var $ = cheerio.load(html);
					let videopagelink = $(".download-link").attr("href");
					console.log("2/3");
					//Getting Video Links
					request(videopagelink, function (error, response, html) {
						let shows = [];
						if (!error) {
							var $ = cheerio.load(html);
							let videosLinks = [];
							$("video").children().each(function (index, item) {
								let link = $(item).attr("src");
								let size = $(item).attr("size");
								videosLinks.push({
									size: size,
									link: link
								})
							});
							console.log("3/3");
							res.send({
								videos: videosLinks
							});

						}
					});
				}
			});
		}
	});
})

// define the first route
app.get("/", function (req, res) {
	res.send("<p>Api is working!</p> ");
});

// start the server listening for requests
app.listen(process.env.PORT || 9000, () => {
	console.clear();
	console.log("Server is running...")
});
