// Mock initial posts
let posts = [
  { id: 1, title: 'Do FS Experiment', description: 'Complete the experiment', date: '2026-08-04', time: '08:00' },
  { id: 2, title: 'UID - 24BAI71013', description: 'Mark attendance', date: '2026-08-04', time: '12:30' },
  { id: 3, title: '24BAI71013@cuchd.in', description: 'Email the Student', date: '2026-08-05', time: '18:00' },
  { id: 4, title: 'Full Stack Development', description: 'Happy coding!', date: '2026-08-10', time: '09:00' },
];

let nextId = 5;

export const getPosts = () => {
  return [...posts];
};

export const addPost = (post) => {
  const newPost = { ...post, id: nextId++ };
  posts.push(newPost);
  return newPost;
};

export const updatePost = (id, updatedPost) => {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
    return posts[index];
  }
  return null;
};

export const deletePost = (id) => {
  posts = posts.filter(p => p.id !== id);
};

export const movePostToDate = (id, newDate) => {
  const post = posts.find(p => p.id === id);
  if (post) {
    post.date = newDate;
    return post;
  }
  return null;
};