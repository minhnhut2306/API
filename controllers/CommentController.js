const CommentModel = require("./CommentModel");  
const ProductModel = require("./ProductModel");

const UserModel = require("./UserModel");



const addComment = async (userId, productId, rating, comment, images, videos, displayName) => {
  try {
 
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("User not found");
    }

    const productInDB = await ProductModel.findById(productId);
    if (!productInDB) {
      throw new Error("Product not found");
    }


    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    const newComment = new CommentModel({
      user: userInDB,
      productId,
      rating,
      comment,
      images,
      videos,
      displayName,
    });

    const result = await newComment.save();
    return result;
  } catch (error) {
    console.log("addComment error: ", error.message);
    throw new Error("Error adding comment");

  }
};
module.exports = {

  addComment

};
