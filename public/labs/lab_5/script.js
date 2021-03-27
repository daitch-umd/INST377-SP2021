function mapInit() {
  let mymap = L.map('mapid').setView([51.505, -0.09], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZGFpdGNoLXVtZCIsImEiOiJja203Mms0bGMwdHppMm5wbWJ3ZG9sbTl3In0.aKCQkdfv-CtDjm7euMwsxQ'
  }).addTo(mymap);
  // follow the Leaflet Getting Started tutorial here
  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);
  const restaurants = await request.json();

  function findMatches(wordToMatch, restaurants) {
    const tempArr = restaurants.filter(place => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.zip.match(regex)
    });
    const tempSet = new Set(tempArr.map(place => place.establishment_id));
    const unique_ids = Array.from(tempSet).slice(0,9);
    console.log(unique_ids);
    let id_length  = unique_ids.length-1;
    const results = [];
    //iterate through the list
    while (id_length >= 0) {
      for (place in restaurants) {
        // compare the value of the restaurants key to value in unique keys
        if (restaurants[place].establishment_id == unique_ids[id_length] && unique_ids.length > 0) {
          
          let catThis = restaurants[place];
          results.push(catThis);
          console.log(unique_ids.pop());
          id_length = unique_ids.length-1;
        }
      }
    }
  
    const filteredData = results.filter((record) => record.geocoded_column_1);
    
    return results;
  }


  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, restaurants);
    const html = matchArray.map(place => {
    return `
      <div class="box">
        <li>
          <address>
            <h2 class="subtitle is-3"><span class="name">${place.name}</span></h2>
            <span class="address">${place.address_line_1}</span> <br>
            ${place.city}, ${place.state} ${place.zip} <br>
            </br>
            <span class="category">${place.category} <br>
            <span class="quarantining">Quarantining: ${place.ill_workers_restricted}</span>
          </address>
        </li>
      </div>
    `
    }).join('');
    suggestions.innerHTML= html;
  }

  const searchInput = document.querySelector('.input');
  const suggestions = document.querySelector('.suggestions');

  //searchInput.addEventListener('keyup', (evt) => { displayMatches(evt) });
  
  searchInput.addEventListener('submit', async (myEvent) => { 
    displayMatches(myEvent);
    /*
    myEvent.preventDefault();
    const filtered = findMatches(myEvent.target.value, restaurants).filter((record) => record.geocoded_column_1);

    filtered.forEach((item) => {
      const longLat = item.geocoded_column_1.coordinates;
      const marker = L.marker([longLat[1], longLat[0]]).addTo(mapObjectFromFunction);
      const appendItem = document.createElement('li');
      appendItem.classList.add('block');
      appendItem.classList.add('list-item');
      appendItem.innerHTML = `<div class="list-header is-size-5">${item.name}</div><address class="is-size-6">${item.address_line_1}</address>`;
      suggestions.append(appendItem);
    });
    */
  });
  
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;