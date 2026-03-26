import config from '../../config/config';

export const uploadToImgBB = async (file: any): Promise<string> => {
  console.log('HIT the akjf');
  try {
    console.log('Starting ImgBB upload for file:', file.name, 'Size:', file.size, 'Mimetype:', file.mimetype);

    const formData = new FormData();
    // In express-fileupload, the file content is in file.data (Buffer)
    const blob = new Blob([file.data], { type: file.mimetype });
    formData.append('image', blob, file.name);

    console.log('Sending request to ImgBB...');
    const response = await fetch(`https://api.imgbb.com/1/upload?key=9d65c099cac2687505d89452abc75d04`, {
      method: 'POST',
      body: formData,
    });

    console.log('ImgBB Response Status:', response.status);
    const result: any = await response.json();
    console.log('ImgBB Response Body:', JSON.stringify(result, null, 2));

    if (result.success) {
      return result.data.url;
    } else {
      console.error('ImgBB Upload Error Result:', result);
      throw new Error(result.error?.message || 'Failed to upload image to ImgBB');
    }
  } catch (error: any) {
    console.error('ImgBB Upload Exception:', error);
    throw new Error(error.message || 'ImgBB Upload Exception');
  }
};
