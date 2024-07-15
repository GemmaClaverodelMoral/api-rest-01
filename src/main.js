const API_URL_RANDOM =     "https://api.thecatapi.com/v1/images/search?limit=6"
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites'
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`
const API_URL_UPLOAD =     "https://api.thecatapi.com/v1/images/upload"

const API_KEY = "live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq"

reloadbtn = document.querySelector('button')
errorDOM = document.querySelector('#error')
errorDOM.innerHTML = 'Aqui saldran los errores, ... si los hay'

// //******* CON FUNCION ASINCRONA 

async function cargarImagenesRandom() {
    try 
    {
        const res = await fetch( API_URL_RANDOM, 
        {
            headers: 
            {
                'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
            }
        })
        
        const data = await res.json()
        for (let i = 1; i<=6 ; i++)
        {
            const img = document.querySelector(`#img0${i}`)
            const src = data[i-1].url
            img.src = src
            img.onclick = () => saveFavourite(data[i-1].id)
        }
   } 
   
   catch (error) 
   {
        console.log('error descargando imagenes random', error.message)
        error.innerHTML = error.message
   }

}
async function cargarFavoritas(){
    try 
    {
        const res = await fetch( API_URL_FAVOURITES, {
            method: 'GET',
            headers: {
                'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
            }
        })
        const data = await res.json();
        console.log('descarga total de Favoritas',data)
        const favouritesList = document.getElementById('favourites-list')
        favouritesList.innerHTML = '';
        data.forEach( image => {
            const loadImage = document.createElement('img')
            loadImage.src = image.image.url
            loadImage.alt = "Fotos gatos favoritas"
            loadImage.onclick = () => favouriteOut(image.id)
            favouritesList.appendChild(loadImage)
        });
    }
    catch (error) 
    {
        console.log('error descargando favoritas', error.message)
        error.innerHTML = error.message
    }
}
async function saveFavourite(id) { // como saber cual es el id de la foto que espicharon?
    try
    {
        const res = await fetch(API_URL_FAVOURITES, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
                },
                body: JSON.stringify({image_id : id})
            })
            const data = await res.json()
            console.log('imagen añadida a favoritos')
            cargarFavoritas()
    }
    catch (error) {
        console.log('error salvando nueva favorita', error.message)
        error.innerHTML = error.message
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
    const form = document.getElementById("load-img-form")
    const formData = new FormData()
    const res = await fetch(API_URL_UPLOAD,
        {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY
            },
            body: formData
        }
    )
    console.log('Foto de gatitos subida', res)
}


cargarImagenesRandom()
cargarFavoritas()


//  function handleDoubleClick(event) {
//     const imageId = event.target.id;
//     console.log('Imagen doble clickeada:', imageId);

// }


// const images = document.querySelectorAll('#favourites-list img');


// images.forEach(img => {
//     img.addEventListener('click', handleSingleClick);
//     img.addEventListener('dblclick', handleDoubleClick);
// });
