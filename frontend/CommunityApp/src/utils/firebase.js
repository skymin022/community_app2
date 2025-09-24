// firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';
import RNFetchBlob from 'rn-fetch-blob';

// Firebase Web App 설정 (Firebase 콘솔 > 프로젝트 설정)
// const firebaseConfig = {
//   apiKey: "AIzaSyCSwLVkPvPEfIuTrIqGlbn_ncQyp5R2S5g",
//   authDomain: "communityapp-49872.firebaseapp.com",
//   projectId: "communityapp-49872",
//   storageBucket: "communityapp-49872.firebasestorage.app",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "1:852443453086:android:2a8f403dcdb2e486d50d8f",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCSwLVkPvPEfIuTrIqGlbn_ncQyp5R2S5g",
  authDomain: "communityapp-49872.firebaseapp.com",
  databaseURL: "https://communityapp-49872.firebaseio.com",
  projectId: "communityapp-49872",
  storageBucket: "communityapp-49872.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:852443453086:android:2a8f403dcdb2e486d50d8f",
};


// 앱이 초기화 되어있지 않으면 초기화 수행
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Storage 인스턴스 생성
const storage = getStorage(app);
export const uploadImageToFirebase = async (imageAsset) => {
  try {
    const fileName = `images/${Date.now()}_${imageAsset.fileName || 'image.jpg'}`;
    const storageRef = ref(storage, fileName);

    let uri = imageAsset.uri;

    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      const stat = await RNFetchBlob.fs.stat(uri);
      uri = stat.path;
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
  console.error('Firebase upload error:', error);
  if (error.code) console.error('Error code:', error.code);
  if (error.message) console.error('Error message:', error.message);
  if (error.customData) console.error('Custom data:', error.customData);
  if (error.serverResponse) {
    try {
      const parsed = JSON.parse(error.serverResponse);
      console.error('Server response:', parsed);
    } catch {
      console.error('Server response (raw):', error.serverResponse);
    }
  }
  throw error;
}

};