// src/routes/+page.js
import { getCategories, getWorks, getOwner } from '$lib/services/pocketbase';

export async function load({ fetch }) {
  const categories = await getCategories(fetch);
  const works = await getWorks(fetch);
  const owner = await getOwner(fetch, 'dwuvjtbcmpf5pz0');

  return {
    categories,
    works,
    owner
  };
}