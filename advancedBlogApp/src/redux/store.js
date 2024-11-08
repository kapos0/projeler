import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import likedPostsReducer from "./slices/likedSlice";
export const store = configureStore({
	reducer: {
		posts: postsReducer,
		likedPosts: likedPostsReducer,
	},
});
