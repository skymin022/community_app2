// firebaseStorage.js
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

// 이미지 파일을 Firebase Storage에 업로드하는 함수
export const uploadImageToFirebase = async (imageAsset) => {
  try {
    const fileName = `images/${Date.now()}_${imageAsset.fileName || 'image.jpg'}`;
    let filePath = imageAsset.uri;

    // Android content:// URI는 file 경로로 변환 필요 (react-native-get-real-path 등 활용 가능)
    if (Platform.OS === 'android' && filePath.startsWith('content://')) {
      throw new Error('content:// URI는 file 경로로 변환 필요. react-native-get-real-path 등 사용하세요.');
    }

    // file:// prefix 제거
    if (filePath.startsWith('file://')) {
      filePath = filePath.replace('file://', '');
    }

    // Storage에 파일 업로드
    const reference = storage().ref(fileName);
    await reference.putFile(filePath);
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};