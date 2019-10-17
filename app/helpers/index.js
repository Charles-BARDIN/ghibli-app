const GHIBLI_API_LOCATION_FETCH_URL = 'https://ghibliapi.herokuapp.com/locations/'
const GHIBLI_API_PEOPLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/people/'
const GHIBLI_API_VEHICLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/vehicles/'
const GHIBLI_API_MOVIE_FETCH_URL = 'https://ghibliapi.herokuapp.com/films/'
const GHIBLI_API_SPECIES_FETCH_URL = 'https://ghibliapi.herokuapp.com/species/'

const getPeopleIDFromURL = url => url.replace(GHIBLI_API_PEOPLE_FETCH_URL, '') || undefined
const getLocationIDFromURL = url => url.replace(GHIBLI_API_LOCATION_FETCH_URL, '') || undefined
const getVehicleIDFromURL = url => url.replace(GHIBLI_API_VEHICLE_FETCH_URL, '') || undefined
const getMovieIDFromURL = url => url.replace(GHIBLI_API_MOVIE_FETCH_URL, '') || undefined
const getSpecieIDFromURL = url => url.replace(GHIBLI_API_SPECIES_FETCH_URL, '') || undefined

export { getPeopleIDFromURL, getLocationIDFromURL, getVehicleIDFromURL, getMovieIDFromURL, getSpecieIDFromURL }
