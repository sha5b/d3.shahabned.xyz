import PocketBase from 'pocketbase'

const pb = new PocketBase(`${import.meta.env.VITE_API_URL}`)

export const load = async () => {
	const categories = await pb.collection('categories').getFullList({
		sort: '-title'
	})

	const works = await pb.collection('works').getFullList({
		sort: '-date',
		expand: 'category, reference, colab, exhibitions'
	})

	const owner = await pb.collection('users').getOne('dwuvjtbcmpf5pz0')

	return {
		categories,
		works,
		owner
	}
}

