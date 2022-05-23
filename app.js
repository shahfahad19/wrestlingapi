
// create an express app
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
app.use(cors({origin: "*"}));
// const app = express();

//js files
const showslist = require("./getShows");

// use the express-static middleware
app.use(express());

//routing

app.get("/shows", (req, res) => {
	const page = req.query.page || "1";
	console.log(page);
	const url =
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


					if(title.includes("WWE") || title.includes("AEW")) {
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
});


app.get("/videos", (req, res) => {
	const url = req.query.url || "";


	//Getting the url shortner page
	request(url, function (error, response, html) {
		let shows = [];
		if (!error) {
			var $ = cheerio.load(html);
			let link = $(".link-show").attr("href");

			console.log("1/3");
			//Getting Video Page
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
	let url = "";
	res.send("<p>APIs under construction</p> ");
});

// start the server listening for requests
app.listen(process.env.PORT || 9000, () => console.log("Server is running..."));