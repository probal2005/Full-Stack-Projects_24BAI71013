import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: 1,
      title: "Learn Redux Toolkit",
      platform: "Facebook",
      likes: 15,
      published: true,
    },
    {
      id: 2,
      title: "Memoized Selectors",
      platform: "LinkedIn",
      likes: 8,
      published: false,
    },
    {
      id: 3,
      title: "React Performance",
      platform: "Instagram",
      likes: 22,
      published: true,
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

    incrementLikes: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      );

      if (post) {
        post.likes += 1;
      }
    },
  },
});

export const {
  addPost,
  deletePost,
  togglePublished,
  incrementLikes,
} = postSlice.actions;

export default postSlice.reducer;