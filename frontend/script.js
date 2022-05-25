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
        url: "https://wrestlingapi.vercela.app/?page=" + page,
        success: function (data) {
            Swal.close();
            $("#more").show();
            showData(data);
        },
        error: function () {
            Swal.fire({
                icon: "error",
                text: "Something went wrong!",
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
					<img class="w-100 rounded" src="${data[i].image}" />
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
        url: "https://wrestlingapi.vercel.app/watch?v=" + src,
        success: function (data) {
            window.scrollTo(0, 0);
            $("#vid").show();
            $("#main").hide();
            $("#more").hide();
            Swal.close();
            let source =
                data.videos.length == 1
                    ? data.videos[0].link
                    : data.videos[1].link;

            if (data.videos.length == 1) {
                $("#qualities").hide();
            } else {
                $("#sd").attr("onclick", `playVideo('${data.videos[1].link}')`);
                $("#sd").attr(data.videos[1].size);

                $("#hd").attr("onclick", `playVideo('${data.videos[0].link}')`);
                $("#hd").attr(data.videos[0].size);
            }

            playVideo(source);
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

const playVideo = (video) => {
    $("#dl").attr("href", video);
    $("#playerContainer").html("");
    const config = {
        autoplay: true,
        sources: [
            {
                type: "mp4",
                src: video,
            },
        ],
    };

    const element = document.getElementById("playerContainer");
    const player = IndigoPlayer.init(element, config);
};

const goBack = () => {
    $("#playerContainer").html("");
    $("#vid").hide();
    $("#main").show();
    $("#more").show();
};
