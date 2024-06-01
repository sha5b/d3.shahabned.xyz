// src/lib/utils/getURL.js
// @ts-nocheck

const getBaseURL = () => import.meta.env.VITE_API_URL;

export const getImageURL = (collectionId, recordId, fileName, size = '0x0') => {
  const url = `${getBaseURL()}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
  console.log(`Generated image URL: ${url}`); // Add this line for debugging
  return url;
};

export const getVideoURL = (collectionId, recordId, fileName, size = '0x0') => {
  return `${getBaseURL()}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const getAudioURL = (collectionId, recordId, fileName, size = '0x0') => {
  return `${getBaseURL()}api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};
