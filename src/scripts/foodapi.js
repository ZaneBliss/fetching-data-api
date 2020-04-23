const foodElementor = (foods) => `
    <div class="container">
        <h1>${foods.name}</h1>
        <p>Category: ${foods.category}</p>
        <p>Ethnicity: ${foods.ethnicity}</p>
        <p>Ingredients: ${foods.ingredients}</p>
        <p>Origin: ${foods.origins}</p>
        <p>Calories: ${foods.calories}</p>
        <p>Fat per serving: ${foods.fat}</p>
        <p>Sugar per serving: ${foods.sugar}</p>
    </div>
`;

function foodToDom(food) {
  foodElement = document.querySelector(".foodList");
  foodElement.innerHTML += food;
}

// fetch("http://localhost:8088/food")
//     .then(foods => foods.json())
//     .then(parsedFoods => {
//       parsedFoods.forEach(food => {
//           const foodElement = foodElementor(food)
//           foodToDom(foodElement)
//       });
//     })

fetch("http://localhost:8088/food")
  .then((response) => response.json())
  .then((myParsedFoods) => {
    myParsedFoods.forEach((food) => {
      console.log(food); // Should have a `barcode` property

      // Now fetch the food from the Food API
      fetch(
        `https://world.openfoodfacts.org/api/v0/product/${food["barcode"]}.json`
      )
        .then((response) => response.json())
        .then((productInfo) => {
          if (productInfo.product.ingredients_text) {
            food.ingredients = productInfo.product.ingredients_text;
          } else {
            food.ingredients = "no ingredients listed";
          } if (productInfo.product.origins) {
            food.origins = productInfo.product.origins;
          } else {
              food.origins = "no country of origin listed";
          } if (productInfo.product.nutriscore_data.energy) {
              food.calories = productInfo.product.nutriscore_data.energy * 0.23900573614;
          } else {
              food.calories = "no calories listed";
          } if (productInfo.product.nutriments.fat_serving) {
              food.fat = productInfo.product.nutriments.fat_serving 
          } else {
              food.fat = "no fat per serving listed" ;
          } if (productInfo.product.nutriments.sugars_serving) {
              food.sugar = productInfo.product.nutriments.sugars_serving;
          } else {
              food.sugar = "no sugar listed";
          }


          // Produce HTML representation
          const foodElement = foodElementor(food);

          // Add representation to DOM
          foodToDom(foodElement);
        });
    });
  });
