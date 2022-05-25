window.onload = function() {
     loadData();
     $("#back").hide();
	$("#vid").hide();
	let timerInterval;
}
let page =0;

const loadData=() =>{
	page++;
	$("#more").hide();
	$.ajax({
		url: "https://wrestlingapi.vercel.app/shows?page="+page,
			success: function(data){
		    	$("#more").show();
				showData(data);
			},
			error: function(){
				alert("Something went wrong");
			}
	});
} 

const showData = (data) => {
	$("#playerContainer").html("");
	for (let i = 0; i<data.length;i++) {
		$('#main').append(`<div class="tile col-6 col-sm-4 col-md-3 col-lg-2 p-1 border" onclick="startPlayer('${data[i].link}', '${data[i].image})')">
			<img class="w-100" src="${data[i].image}" />
			<p>${data[i].title}</p>
			</div>`);
	}
}

const startPlayer = (src, img) => {
let src2 = src;
if (src2.includes("nxt")){
		src2 = src2.replace(/[0-9]/g, ''). replace('https://akwam.to/shows/', '').replace("/wwe-nxt", "");
		src = src.replace(src2[0], "%20"); 
	} 
	Swal.fire({
		title: 'Loading',
		html: 'Please wait. The video is loading!',
		allowOutsideClick: false,
		didOpen: () => {
			Swal.showLoading()
		}
	})
	$.ajax({
		url: "https://wrestlingapi.vercel.app/videos?url="+src,
		success: function(data){
			$("#vid").show();
			$("#main").hide();
			$("#more").hide();
			Swal.close();
			let source = data.videos.length == 1 ? data.videos[0].link : data.videos[1].link;
			
			if (data.videos.length ==1) {
				$("#qualities").hide();
			}
			else {
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
				icon: 'error',
				title: 'Error',
				text: 'This show is not available!',
			})
		}
	});
}

const playVideo = (video) => {
	$("#dl").attr("href", video);
	$("#playerContainer").html("");
	const config = {
		autoplay: true, 
		sources: [{
			type: 'mp4',
			src: video
		}]
	};

	const element = document.getElementById('playerContainer');
	const player = IndigoPlayer.init(element, config);
}

const goBack =() => {
	$("#playerContainer").html("");
     $("#vid").hide();
     $("#main").show();
     $("#more").show();
} 
