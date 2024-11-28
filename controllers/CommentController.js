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
const getComments = async (userid) => {
  try {
    const userInDB = await UserModel.findById(userid);
    console.log('userInDB', userInDB);
    
    if (!userInDB) {
      throw new Error("User not found");
    }
    const comments = await CommentModel.find({ user: userInDB._id });
    console.log('comments', comments);

    if (comments.length === 0) {
      return { status: false, message: "No comments found for this user" };
    }

    return { status: true, data: comments };

  } catch (error) {
    console.log("getComments error: ", error.message);
    throw new Error("Error getting comments");
  }
}

module.exports = {
  addComment,
  getComments,
};
