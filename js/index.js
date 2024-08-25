


console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
          songs.push(element.href.split(`/${folder}/`)[1])
      }
  }

   
    //show all the songs un the playlist
let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
songUL.innerHTML= ""
for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML+`<li><i class="fa-brands fa-spotify"></i>
    <div class="info">
      <div>    ${song.replaceAll("%20"," ")}</div>
      <div></div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <i style="background-color: #fff; color: black; padding:  7px 8px 7px 10px; border-radius: 50%; cursor: pointer;" class="fa-solid fa-play splay"></i>
    </div></li>`;
}

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

      })
  })

  return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  
  if (!pause) {
    if (currentSong.paused) {
      currentSong.play();
      const playIcon = document.getElementById('play-icon');
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
    } else {
      currentSong.pause();
      const playIcon = document.getElementById('play-icon');
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
    }
  }
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};



//display all the albums
async function displayAlbums(){
  let a = await fetch(`/songs/`)
  let response =await a.text();
  let div= document.createElement("div")
  div.innerHTML = response;
  let anchors =div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
 let array = Array.from(anchors)
 for(let index=0; index < array.length; index++){
  const e=array[index];
  if(e.href.includes("/songs") &&  !e.href.includes(".htaccess"))
     folder=e.href.split("/").slice(-2)[0]
 }
  }




async function main(){

    //Get the list of all the songs
  await getSongs("songs/cs")
     playMusic(songs[0],true)

     //display all albums on the page
displayAlbums()

//attach an event listener to play , next and previous.
const playButton = document.getElementById('play');
const playIcon = document.getElementById('play-icon');

playButton.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
  } else {
    currentSong.pause();
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
  }
});

//listen for time update event
currentSong.addEventListener("timeupdate",()=>{

  document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + '%';
})
// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%"; currentSong.currentTime = ((currentSong.duration)* percent)/100
  })
  
  // Add an event listener for hamburger
  document.querySelector("#hamburger").addEventListener("click", ()=>{ document.querySelector(".left").style.left = "0"
  })
  // Add an event listener for close button 
  document.querySelector(".close").addEventListener("click", ()=>{ document.querySelector(".left").style.left = "-120%"
  })
// Add an event listener to previous
previous.addEventListener("click", ()=>{
  currentSong.pause()
  console.log("Previous clicked")
  let index = songs.indexOf (currentSong.src.split("/").slice(-1) [0])
  if((index-1) >= 0) {
  playMusic(songs [index-1])
  }
  })

  // Add an event listener to next
  next.addEventListener("click", ()=>{
    currentSong.pause()
  console.log("Next clicked")
  let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
  if((index+1) < songs.length) {
  playMusic(songs [index+1])
  }
  })


// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
(e)=>{
console.log("Setting volume to", e.target.value, "/100")
currentSong.volume= parseInt(e.target.value)/100
})

// Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item=>{ 
  songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  playMusic(songs[0])
  })
})

}

main()
