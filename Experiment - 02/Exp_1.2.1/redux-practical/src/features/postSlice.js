import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: 1,
      title: "Welcome to Redux Toolkit",
      platform: "Facebook",
      published: false,
    },
  ],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    togglePublished: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      );

      if (post) {
        post.published = !post.published;
      }
    },
  },
});

export const {
  addPost,
  deletePost,
  togglePublished,
} = postSlice.actions;

export default postSlice.reducer;