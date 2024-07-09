const API_URL_RANDOM =     "https://api.thecatapi.com/v1/images/search?limit=6"
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites?api_key=live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/:${id}`

const API_KEY = "live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq"
  
reloadbtn = document.querySelector('button')
error = document.querySelector('#error')

// //******* CON FUNCION ASINCRONA 

async function recargarImagenAsyncronica() {
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
        revisarYmostrarError(res, data)
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
        console.log('error descargando imagenes', error.message)
        error.innerHTML = error.message
   }

}
recargarImagenAsyncronica()

async function loadFavourites(){
    const res = await fetch( API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
        }
    })
    const data = await res.json();
    revisarYmostrarError(res, data)
    console.log('load data', data)
    data.forEach( image => {
        const favouritesList = document.getElementById('favourites-list')
        const loadImage = document.createElement('img')
        loadImage.src = image.image.url
        loadImage.alt = "Fotos gatos favoritas"
        
        //loadImage.onclick = () => favouriteOut(image.id)
        favouriteOut(image.id)
        favouritesList.appendChild(loadImage)
});
}
loadFavourites()

async function saveFavourite(id) { // como saber cual es el id de la foto que espicharon?
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
    console.log('res en save:',res)
    console.log('data en save:', data)
    revisarYmostrarError(res, data)

}

async function favouriteOut(id) {
    console.log('gatito a eliminar:',id)
    const res = await fetch(API_URL_FAVOURITES_DELETE(id),
        {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'live_eMgT6uUDyZPYQeb0AMktYVCzGkiic7BMm2IuLHwxvYR0PyGx7gEnCr14sM3tsZxq'
        },
        body: JSON.stringify({image_id : id})
        })
    const data = await res.json()
    console.log('res a eliminar',res)
    console.log('data al eliminar',data)
    revisarYmostrarError(res, data)
};

function revisarYmostrarError(respuesta, dat) {
    if (respuesta.status !== 200) {
        console.log('en revisar error', respuesta, dat)
        error.innerHTML = respuesta.status + ' : ' + dat.message

    }
}