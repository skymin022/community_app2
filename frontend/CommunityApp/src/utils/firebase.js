import storage from '@react-native-firebase/storage';

export const uploadImageToFirebase = async (imageAsset) => {
  try {
    const fileName = `images/${Date.now()}_${imageAsset.fileName || 'image.jpg'}`;
    const reference = storage().ref(fileName);
    
    await reference.putFile(imageAsset.uri);
    const downloadURL = await reference.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};