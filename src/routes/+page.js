import PocketBase from 'pocketbase';

const pb = new PocketBase(`${import.meta.env.VITE_API_URL}`);

export const load = async ({ fetch }) => {
	// Use the fetch function passed to the load function for fetching data
	const categories = await pb.collection('categories').getFullList({
		sort: '-title',
		fetch
	});

	const works = await pb.collection('works').getFullList({
		sort: '-date',
		expand: 'category, reference, colab, exhibitions',
		fetch
	});

	const owner = await pb.collection('users').getOne('dwuvjtbcmpf5pz0', { fetch });

	return {
		categories,
		works,
		owner
	};
};
