// @ts-nocheck

export const getImageURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `${
		import.meta.env.VITE_API_URL
	}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`
}

export const getVideoURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `${
		import.meta.env.VITE_API_URL
	}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`
}

export const getAudioURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `${
		import.meta.env.VITE_API_URL
	}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`
}
