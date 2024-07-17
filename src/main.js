const API_URL_RANDOM =                    "https://api.thecatapi.com/v1/images/search?limit=8"
const API_URL_FAVOURITES =                "https://api.thecatapi.com/v1/favourites"
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`
const API_URL_UPLOAD =                    "https://api.thecatapi.com/v1/images/upload"

const API_KEY = "live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq"

const reloadbtn    = document.querySelector('button')
const errorDOM     = document.querySelector('#error')
const form         = document.querySelector("#load-img-form");
const inputFile    = document.querySelector('#file')
const imagePreview = document.querySelector('#image-preview');



async function cargarImagenesRandom() {
    const res = await fetch( API_URL_RANDOM, 
    {
        headers: 
        {
            'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
        }
    })
    const data = await res.json()

    if (res.status !==200) {
        console.log('error descargando imagenes random', data.message)
        errorDOM.style.display = 'inline'
        errorDOM.innerHTML = data.message
    } else {
        const randomList = document.getElementById('random-list')
        randomList.innerHTML = '';
        for (let i = 1; i<=8 ; i++)
        {
            const img = document.createElement('img')
            img.src = data[i-1].url
            img.alt = "Foto Gatitos aleatoria"
            randomList.appendChild(img)
            img.onclick = () => saveFavourite(data[i-1].id)
        }
    }

}

async function cargarFavoritas(){
    const res = await fetch( API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
        }
    })
    const data = await res.json();

    if (res.status !==200) {
        console.log('error descargando favoritas', data.message)
        errorDOM.innerHTML = data.message
    } else {
        const favouritesList = document.getElementById('favourites-list')
        favouritesList.innerHTML = '';
        for (let i = data.length - 1; i >= 0; i--) {
            const image = data[i];
            const loadImage = document.createElement('img');
            loadImage.src = image.image.url;
            loadImage.alt = "Fotos gatos favoritas";
            loadImage.onclick = () => favouriteOut(image.id);
            favouritesList.appendChild(loadImage);
        }
    }
}

async function saveFavourite(id) {

    const res = await fetch(API_URL_FAVOURITES, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
            },
            body: JSON.stringify({image_id : id})
        })
    
    if (res.status !==200) {
        console.log('error salvando nueva favorita', res)
        errorDOM.style.visibility = 'visible'
        errorDOM.innerHTML = res.status + ': Error salvando imagen'
    } else {
        const data = await res.json()
        console.log('imagen añadida a favoritos')
        cargarFavoritas()
    }
}

async function favouriteOut(id) {
    console.log('gatito a eliminar:',id)
    const res = await fetch(API_URL_FAVOURITES_DELETE(id),
        {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY
        }
        })
    const data = await res.json()
    console.log('res.status: ',res.status)
    if (res.status !== 200){
        errorDOM.innerHTML = data.message
        console.log('mensaje:', data.message)
    } else {
        console.log('imagen eliminada de favoritos', 'res:', res, 'data:', data)
        cargarFavoritas()
    }
}

async function uploadGato() {
    
    const formData = new FormData(form);
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY
        },
        body: formData,
    });

    const data = await res.json();
    if (res.status !== 201) {
        console.log('error subiendo imagen', res);
        const errorDOM = document.getElementById('error');
        errorDOM.style.visibility = 'visible';
        errorDOM.innerHTML = `${res.status}: Error subiendo imagen`;
    } else {
        console.log('imagen añadida a la API');
        saveFavourite(data.id)  // Se incluye automaticamente la foto subida del local a nuestros favoritos. 
        cargarFavoritas(); // Asegúrate de definir esta función correctamente en tu main.js
    }
}

cargarImagenesRandom()
cargarFavoritas()

inputFile.addEventListener('change', verMiniatura)
        
function verMiniatura() {

    const file = inputFile.files[0];
    console.log('aqui debe estar el fichero de la imagen: ',file)
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            } 

        reader.readAsDataURL(file);
    } else {
         imagePreview.style.display = 'none'
    }
};

//  function handleDoubleClick(event) {
//     const imageId = event.target.id;
//     console.log('Imagen doble clickeada:', imageId);

// 4XL 6L 2M - 1 Yhan 10 Omar Juan Gris - 


// const images = document.querySelectorAll('#favourites-list img');


// images.forEach(img => {
//     img.addEventListener('click', handleSingleClick);
//     img.addEventListener('dblclick', handleDoubleClick);
// });
