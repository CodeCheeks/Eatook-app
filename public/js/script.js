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

  