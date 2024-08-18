// let show=document.querySelector('#Show_More');

// let i=10;
// let j=20;
// let k=0;
// document.addEventListener('DOMContentLoaded', () => {
//     const prevButton = document.querySelector('.prev-button');
//     const nextButton = document.querySelector('.next-button');
//     const carouselWrapper = document.querySelector('.carousel-wrapper');
//     const images = document.querySelectorAll('.carousel-image');
//     const totalImages = images.length;
//     let index = 0;

//     function updateCarousel() {
//         const offset = -index * 100; 
//         carouselWrapper.style.transform = `translateX(${offset}%)`;
//         images.forEach((img, i) => {
//             img.classList.toggle('active', i === index);
//         });
//     }

//     prevButton.addEventListener('click', () => {
//         index = (index - 1 + totalImages) % totalImages;
//         updateCarousel();
//     });

//     nextButton.addEventListener('click', () => {
//         index = (index + 1) % totalImages;
//         updateCarousel();
//     });

//     // Initialize carousel
//     updateCarousel();
// });


// async function fetchApi(mobile)
// {
//     let newdiv=document.querySelector('.apiImages');
//     if(!mobile)
//         mobile="apple";
//     else{
//         newdiv.innerHTML="";
//         i=0;j=10;
//     }
    
//     show.addEventListener('click',()=>{
//         for( i ; i<j;i++){
//             newdiv.innerHTML+=`
//         <div style="display: flex;flex-direction: column; justify-content: center; align-items: center;">
//         <img src="${jsondata.data[i].image}" alt="">
//             <h3>${jsondata.data[i].phone_name}</h3>
        
//         </div>`;
//         }

//     })
   
        
//     let data= await fetch(`https://openapi.programming-hero.com/api/phones?search=${encodeURIComponent(mobile)}`);
//     let jsondata=await data.json();

//     for( k =0 ; k<10;k++){
//         newdiv.innerHTML+=`
//     <div style="display: flex;flex-direction: column; justify-content: center; align-items: center;">
//     <img src="${jsondata.data[k].image}" alt="">
//         <h3>${jsondata.data[k].phone_name}</h3>
    
//     </div>`;
//     }
  
    
// // show.addEventListener('click',()=>{

// //     for( i ; i<j;i++){
// //         newdiv.innerHTML+=`
// //     <div style="display: flex;flex-direction: column; justify-content: center; align-items: center;">
// //     <img src="${jsondata.data[i].image}" alt="">
// //         <h3>${jsondata.data[i].phone_name}</h3>
    
// //     </div>`;
// //     }


// // })




// j=j+10;
// if(j+10>jsondata.data.length)
//     return;

    

// }

// fetchApi();



// async function searchtheMobile()
// {
//     let searchInput = document.querySelector('#search');
//     if (!searchInput) {
//         console.error('Element with id "search" not found');
//         return;
//     }

//     // Call fetchApi with the value of the input field
//     fetchApi(searchInput.value);
    

// }



let currentStart = 0; // Starting index for images
let batchSize = 10;   // Number of images to fetch per request
let currentMobile = "apple"; // Current search term
let jsonData = []; // To store fetched data

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const images = document.querySelectorAll('.carousel-image');
    const totalImages = images.length;
    let index = 0;

    function updateCarousel() {
        const offset = -index * 100;
        carouselWrapper.style.transform = `translateX(${offset}%)`;
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    prevButton.addEventListener('click', () => {
        index = (index - 1 + totalImages) % totalImages;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        index = (index + 1) % totalImages;
        updateCarousel();
    });

    updateCarousel(); // Initialize carousel

    // Initial fetch call
    fetchApi(currentMobile);
});

async function fetchApi(mobile) {
    let newdiv = document.querySelector('.apiImages');
    if (!mobile) mobile = "apple";
    if (mobile !== currentMobile) {
        currentMobile = mobile;
        newdiv.innerHTML = ""; // Clear existing content
        currentStart = 0; // Reset start index for pagination
    }

    try {
        let response = await fetch(`https://openapi.programming-hero.com/api/phones?search=${encodeURIComponent(mobile)}`);
        jsonData = await response.json();
        
        if (!jsonData.data || !Array.isArray(jsonData.data)) {
            console.error('Invalid data format:', jsonData);
            return;
        }

        // Render initial images
        renderImages();

        // Set up 'Show More' button
        setupShowMoreButton();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderImages() {
    let newdiv = document.querySelector('.apiImages');
    for (let i = currentStart; i < currentStart + batchSize && i < jsonData.data.length; i++) {
        newdiv.innerHTML += `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <img src="${jsonData.data[i].image}" alt="${jsonData.data[i].phone_name}">
                <h3>${jsonData.data[i].phone_name}</h3>
            </div>`;
    }
    currentStart += batchSize; // Update the start index for the next batch
}

function setupShowMoreButton() {
    let showMoreButton = document.querySelector('#Show_More_Button');
    showMoreButton.removeEventListener('click', handleShowMoreClick); // Remove previous listener
    showMoreButton.addEventListener('click', handleShowMoreClick);
}

function handleShowMoreClick() {
    renderImages();
    if (currentStart >= jsonData.data.length) {
        document.querySelector('#Show_More_Button').disabled = true; // Disable button if no more data
    }
}

async function searchtheMobile() {
    let searchInput = document.querySelector('#search');
    if (!searchInput) {
        console.error('Element with id "search" not found');
        return;
    }
    fetchApi(searchInput.value);
}

document.querySelector('#searchButton').addEventListener('click', searchtheMobile);
