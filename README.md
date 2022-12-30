# 🤚 Hi , TravelKKaebi 입니다!

❓ Problem : 1인 가구의 증가에 따라 혼자 생활하는것이 익숙해지지만, 아직 혼자 여행을 가기에는 두렵다. 😮

‼️ Idea : 그런 분들을 위해 서로의 여행 이야기 또는 고민들을 나누며
즐거운 여행을 할 수 있도록 도와주면 좋지 않을까? 🤔

💯 Solution : 지역별, 축제별 메뉴 등을 미리 저장해두고, 여행성향과 가고자하는 장소가 맞아 원하는 사람끼리 매칭을 도와주는 커뮤니티 사이트를 만들어보자!! 😁

### ⌛️ 개발 기간
* 2022.08.17 ~ 2022.09.16

### 🔨 개발 환경(BackEnd)
- Front
    - Javascript, React, Axios, CSS, Figma
- Back
    - Java - version 11, SpringBoot, Spring Data JPA, Gradle, MySQL, AWS(EC2)

## 주요 기능과 로직

- **로그인** : 카페 자체 로그인 또는 KaKao OAuth 로그인 API 사용
- **축제 검색** : 원하는 태그(지역, 좋아요 등) 선택하면 그에 맞는 여행리스트들을 불러옴
- **댓글 기능** : 여행 상세페이지에서 댓글 등록, 수정, 삭제
- **페이징 기능** : 메인 페이지 검색 결과로 여행리스트를 백에서 프론트로 20개씩 보내줌
- **배포** : AWS EC2로 배포하고 도메인에 연동 (jar파일로 빌드)

## **`메인화면`** ##
  <img src="/image/main.png" width="300" height="300">

## **`로그인 및 회원가입`** ##
<div style="display:flex;justify-content:space-around;">
  <img src="/image/login.png" width="300" height="300">
  <img src="/image/register.png" width="300" height="300">
</div>

## **`같이 가요 화면`** ##
<div style="display:flex;justify-content:space-around;">
  <img src="/image/together.png" width="300" height="300">
  <img src="/image/together1.png" width="300" height="300">
  <img src="/image/together2.png" width="300" height="300">
  <img src="/image/joinmeinsert.png" width="300" height="300">
</div>

## **`DB테이블 구조`** ##
  <img src="/image/table.png" width="300" height="300">
