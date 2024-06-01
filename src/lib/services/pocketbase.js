// src/lib/services/pocketbase.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_API_URL);

export const getCategories = async (fetch) => {
  return await pb.collection('categories').getFullList({ sort: '-title', fetch });
};

export const getWorks = async (fetch) => {
  return await pb.collection('works').getFullList({ sort: '-date', expand: 'category, reference, colab, exhibitions', fetch });
};

export const getOwner = async (fetch, id) => {
  return await pb.collection('users').getOne(id, { fetch });
};
