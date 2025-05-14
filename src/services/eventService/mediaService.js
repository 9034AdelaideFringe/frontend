import { getApiUrl, handleApiResponse } from './config/apiConfig';

/**
 * 上传图片，返回图片URL
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 上传成功后的图片URL
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(getApiUrl('/upload/image'), {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await handleApiResponse(response, '上传图片');
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};