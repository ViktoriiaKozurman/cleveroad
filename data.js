let map;
let marker;

// Ініціалізація карти
function initMap(lat, lon) {
    const pos = { lat, lng: lon };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: pos
    });
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "МКС"
    });
}

// Оновлення позиції на карті
function updateMarker(lat, lon) {
    const pos = { lat, lng: lon };
    marker.setPosition(pos);
    map.setCenter(pos);
}

// Отримання координат ISS
async function getISSLocation() {
    const response = await fetch("https://api.open-notify.org/iss-now.json");
    const data = await response.json();
    const lat = parseFloat(data.iss_position.latitude);
    const lon = parseFloat(data.iss_position.longitude);

    document.getElementById("coords").innerText =
        `Широта: ${lat.toFixed(2)}, Довгота: ${lon.toFixed(2)}`;
    updateMarker(lat, lon);
}

//Екіпаж
async function getCrew() {
    const response = await fetch("https://api.open-notify.org/astros.json");
    const data = await response.json();
    const crewList = document.getElementById("crew-list");
    crewList.innerHTML = "";

    const issCrew = data.people.filter(person => person.craft === "ISS");

    issCrew.forEach(person => {
        const li = document.createElement("li");
        li.innerText = person.name;
        crewList.appendChild(li);
    });

    document.getElementById("crew-count").innerText =
        `Всього на МКС: ${issCrew.length} осіб`;
}

// Оновлення часу і дати
function updateTime() {
    const now = new Date();

    // Формат дати: день.місяць.рік
    const day = String(now.getUTCDate()).padStart(2, '0');
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = now.getUTCFullYear();
    document.getElementById("date").innerText = `Дата: ${day}.${month}.${year}`;

    document.getElementById("time").innerText = now.toUTCString().split(" ")[4];
}

// Запуск всіх функцій
async function start() {
    const response = await fetch("https://api.open-notify.org/iss-now.json");
    const data = await response.json();
    const lat = parseFloat(data.iss_position.latitude);
    const lon = parseFloat(data.iss_position.longitude);

    initMap(lat, lon);
    getCrew();
    updateTime();
    setInterval(getISSLocation, 5000); // умова із завдання - оновлення координат кожні 5 секунд
    setInterval(updateTime, 1000); 
}

start();

