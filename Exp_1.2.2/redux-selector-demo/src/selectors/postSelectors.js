import { createSelector } from "@reduxjs/toolkit";

// Base Selector
const selectPosts = (state) => state.posts.posts;

// Memoized Selectors
export const selectAllPosts = createSelector(
  [selectPosts],
  (posts) => posts
);

export const selectPublishedPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => post.published)
);

export const selectDraftPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => !post.published)
);

export const selectTotalLikes = createSelector(
  [selectPosts],
  (posts) =>
    posts.reduce((total, post) => total + post.likes, 0)
);

export const selectTotalPosts = createSelector(
  [selectPosts],
  (posts) => posts.length
);