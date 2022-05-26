window.onload = function () {
    Swal.fire({
        html: "Loading the shows",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    loadData();
    $("#back").hide();
    $("#vid").hide();
};
let page = 0;

const loadData = () => {
    page++;
    $("#more").hide();
    $.ajax({
        url: "https://watchwrestling.vercel.app/shows/?page=" + page,
        success: function (data) {
            Swal.close();
            $("#more").show();
            showData(data);
        },
        error: function () {
            Swal.fire({
                icon: "error",
                text: "Something went wrong",
            });
        },
    });
};

const showData = (data) => {
    $("#playerContainer").html("");
    for (let i = 0; i < data.length; i++) {
        $("#main").append(`
			<div class="col-6 col-sm-4 col-md-3 col-lg-2 px-1">
				<div class="" onclick="startPlayer('${data[i].link}', '${data[i].image}', '${data[i].title}')">
					<img class="w-100 rounded-lg img-fluid" style="height:250px" src="${data[i].image}" />
					<p class="font-weight-bold text-sm px-1">${data[i].title}</p>
				</div>
			</div>
			`);
    }
};

const startPlayer = (src, img, title) => {
    title = title
        .replace(/[0-9]/g, "")
        .replaceAll(".", "")
        .replaceAll("  ", "");
    Swal.fire({
        html: "Loading " + title,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    $.ajax({
        url: src,
        success: function (data) {
            window.scrollTo(0, 0);
            $("#vid").show();
            $("#main").hide();
            $("#more").hide();
            Swal.close();

            playVideo(data.videos, img);
        },
        error: function (err) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "This show is not available!",
            });
        },
    });
};

const playVideo = (videos, img) => {
    if (videos.length == 2) {
        $("#plyr-container").html(`
            <video id="plyr" playsinline controls data-poster="${img}">
                <source src="${videos[1].link}" type="video/mp4" size="${videos[1].size}" />
                <source src="${videos[0].link}" type="video/mp4" size="${videos[0].size}" />
            </video>
        `);
        $("#download-btns").html(`
            <a href="${videos[1].link}" class="btn btn-primary btn-sm m-2" target="_blank">Download (${videos[1].size}p)</a>
            <a href="${videos[0].link}" class="btn btn-primary btn-sm m-2" target="_blank">Download (${videos[0].size}p)</a>
            `);
    } else {
        $("#plyr-container").html(`
            <video id="plyr" playsinline controls data-poster="${img}">
                <source src="${videos[0].link}" type="video/mp4" size="${videos[0].size}" />
            </video>
        `);
        $("#download-btns").html(`
            <a href="${videos[0].link}" class="btn btn-primary btn-sm m-2" target="_blank">Download (${videos[0].size}p)</a>
            `);
    }
    const player = new Plyr("#plyr");
};

const goBack = () => {
    $("#plyr-container").html("");
    $("#vid").hide();
    $("#main").show();
    $("#more").show();
};
