const path = require('path');
const fs = require('fs');

const rootDir = require('../utils/path');
const Cart = require('./cart');

const p = path.join(rootDir, 'data', 'product.json');

const getDataFromFile = callback => {
  fs.readFile(p, (err, fileContent) => {
    if (!err) {
      return callback(JSON.parse(fileContent))
    }
    callback([]);
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title
    this.description = description
    this.imageUrl = imageUrl
    this.price = price
  }

  save() {
    getDataFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        )
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString();
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err)
        })
      }
    })
  }

  static deleteById(productId) {
    getDataFromFile(products => {
      const product = products.find(prod => prod.id === productId)
      const updatedProduct = products.filter(prod => prod.id !== product.id)
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        if (!err) {
          Cart.deleteProduct(productId, product.price)
        }
      })
    })
  }

  static fetchAll(callback) {
    getDataFromFile(callback)
  }

  static findById(id, callback) {
    getDataFromFile(products => {
      const product = products.find(p => p.id === id)
      callback(product)
    })
  }

}