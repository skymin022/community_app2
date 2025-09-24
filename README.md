# community_app
주제 : 간단한 커뮤니티 앱 MVP 개발

## 주요기능 
1. 회원가입/로그인
2. 글(목록/상세/작성/수정)
3. 이미지 첨부, 댓글 

## 사용 기술 
- Frontend : React Native
- Backend : spring boot, MyBatis, PageHelper, Lombok, jwt 
- Backend - 구조 : controller, domain, service(service, serviceImpl), mapper , util, config 
- DB : MySQL
- 이미지 Firebase 
- 테스트 : android emulator 


## VS Code 사용 확장프로그램 
Extension Pack for Java
Spring Boot Extension Pack
React Native Tools
ES7+ React/Redux/React-Native snippets
Prettier - Code formatter
MySQL (또는 MySQL Shell for VS Code)

## frontend 설치 
npx @react-native-community/cli init CommunityApp

## 필요한 패키지 설치
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install react-native-image-picker
npm install react-native-toast-message
npm install axios
npm install @react-native-firebase/app @react-native-firebase/storage

## android emulator 실행 방법 (react-native 프로젝트 상위 경로에서 실행)
1. Android Studio 실행 후 가상 디바이스 실행 
2. npx react-native start
3. 새로운 터미널에서 npx react-native run-android 실행 (시간이 좀 소요됨 - BUILD SUCCESSFUL 확인 필요)
4. npx react-native doctor 으로 오류 확인 
