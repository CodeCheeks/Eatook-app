function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: mapPoint,
    });
    new google.maps.Marker({
      position: mapPoint,
      map: map
    });
  }
  