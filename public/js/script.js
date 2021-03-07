const like = (element) => {
    axios
    .get(`/restaurant/${element.getAttribute("data-restaurantid")}/like`)
      .then((response) => {
        element.classList.toggle("unliked");
        const likeNumber = element.querySelector("span");
        likeNumber.innerText = Number(likeNumber.innerText) + response.data.add;
      })
      .catch((e) => console.error("Error liking product", e));
  };

  setTimeout(() => {
    document.querySelectorAll('.toast').forEach(toast => {
      console.log(toast)
      new bootstrap.Toast(toast).hide()
    })  
  }, 5000);

  
  var button = document.getElementById('click__button'); // Assumes element with id='button'

  let div = document.getElementById('booking__form');
  div.style.display = 'none'
  button.onclick = function() {
      
      if (div.style.display !== 'none') {
        button.innerHTML = 'BOOK NOW'
        button.style.backgroundColor = 'rgba(154,205,50,1)'
          div.style.display = 'none';
      }
      else {
        button.innerHTML = 'CLOSE'
          button.style.backgroundColor = 'rgba(154,205,50,0.5)'
          div.style.display = 'block';
      }
  };