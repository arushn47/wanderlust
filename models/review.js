import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
    comment: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Review = models.User || model("Review", reviewSchema);

export default Review;