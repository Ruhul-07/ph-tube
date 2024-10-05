
// get remaining time and second

function getTime(time) {
    const hour = parseInt(time / 3600);
    let remainingSec = time % 3600;
    const minute = parseInt(remainingSec / 60);
    remainingSec = remainingSec % 60;
    
    return `${hour} hour ${minute} minute ${remainingSec} sec ago`
}

// active or hidden button function

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons);
    for (let btn of buttons) {
      btn.classList.remove("active");
    }
  };


// create load categories

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error))  
}

// create load videos

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error))  
}

// Load CategoryVideos

const loadCategoryVideos = (id) =>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
        removeActiveClass();

      //id er class k active korbe
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch(error => console.log(error))  
}

// create displayCategories

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories')
    categories.forEach((item) => {
    console.log(item)
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `<button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
       ${item.category}
      </button>`;
    categoryContainer.append(buttonContainer);
    });
}

const loadDetails = async (videoId) => {
    console.log(videoId);
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);
  };
  const displayDetails = (video) => {
    console.log(video);
    const detailContainer = document.getElementById("modal-content");
  
    detailContainer.innerHTML = `
     <img src=${video.thumbnail} />
     <p>${video.description}</p>
    `;
  
    // way-1
    // document.getElementById("showModalData").click();
    //way-2
    document.getElementById("customModal").showModal();
  };

// card demo
// const cardDemo = {
//     "category_id": "1001",
//     "video_id": "aaab",
//     "thumbnail": "https://i.ibb.co/QPNzYVy/moonlight.jpg",
//     "title": "Midnight Serenade",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/fDbPv7h/Noha.jpg",
//             "profile_name": "Noah Walker",
//             "verified": false
//         }
//     ],
//     "others": {
//         "views": "543K",
//         "posted_date": ""
//     },
//     "description": "'Midnight Serenade' by Noah Walker is a soulful journey into the depths of the night, capturing the mystique and allure of a moonlit evening. With 543K views, this song brings together tender melodies and evocative lyrics, making it a favorite among listeners seeking a contemplative yet uplifting experience. Immerse yourself in this musical masterpiece and feel the calm embrace of the night."
// }

// create displayVideos

const displayVideos = (videos) => {
    const videoContainer = document.getElementById("videos")
    videoContainer.innerHTML = "";
    if (videos.length == 0) {
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        
          <img src="assets/Icon.png" /> 
          <h2 class="text-center text-xl font-bold"> No Content Here in this Categery </h2> 
        </div>`;
      } else {
        videoContainer.classList.add("grid");
      }
    videos.forEach((video) => {
        console.log(video)
        const card = document.createElement("div");
        card.classList = "card card-compact";
        card.innerHTML =  `
         <figure class="h-[200px] relative">
            <img
            src=${video.thumbnail}
            class="h-full w-full object-cover"
            alt="" />
            ${video.others.posted_date?.length == 0? "": `<span class="absolute bg-black text-white right-2 bottom-2 rounded p-1">${getTime(video.others.posted_date)}</span>`}
        </figure>
        <div class="px-0 py-2 flex gap-2">
            <div class="w-10 h-10">
                <img
                    src=${video.authors[0].profile_picture}
                    class="h-full w-full object-cover rounded-full"
                    alt="" />
            </div>
            <div> 
                <h2 class="font-bold">
                    <p>${video.title}</p>
                </h2>
                <div class="flex gap-1 items-center">
                    <p class="text-geay-400">${video.authors[0].profile_name}</p>
                    ${video.authors[0].verified === true? `<img class="w-5" src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000" />
                    </div>`: ""}
            </div>
            <div>
                    <button  onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">details</button>
            </div>
                  
        </div>
          `;
        videoContainer.append(card);
    })
}
document.getElementById("search-input").addEventListener("keyup", (e) => {
    loadVideos(e.target.value);
  });
loadCategories();
loadVideos();