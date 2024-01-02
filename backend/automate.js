const fs = require("fs"); // Include the 'fs' module for file operations
const data = require("../dummy1");
const Product = require("./models/productModel");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const automate = async () => {
  try {
    let i = 100;
    let productsToInsert = []; // Create an array to store products

    for (let prod of data) {
      let newProd = {
        name: prod.title,
        description: prod.description,
        price: prod.price,
        ratings: prod.rating.rate,
        images: [
          {
            public_id: `products/${i++}`,
            url: prod.image,
          },
        ],
        category: prod.category,
        Stock: getRandomInt(10, 100),
      };
      productsToInsert.push(newProd); // Add each product to the array
    }

    // Save productsToInsert array as output.json
    // fs.writeFileSync("output.json", JSON.stringify(productsToInsert, null, 2));

    await Product.insertMany(productsToInsert); // Insert all products at once

    console.log("Products inserted successfully");
  } catch (error) {
    console.error(error);
  }
};

automate();
