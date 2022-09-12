import React, { useEffect, useRef, useState } from "react";
import apis from "../../shared/api/main";
import { PopularBoardMap } from "../board/A-boardindex";

//css
import styled from "styled-components";
import { left, right } from "../../shared/svg/A-index";

import { getCookie } from "../../shared/Cookie";
import axios from "axios";
import { editorchoice } from "../../config";

//에러로그
// import * as Sentry from "@sentry/react";

const PopularBoard = () => {
  const [loading, setLoading] = useState(false);
  const [hotEditorArr, setHotEditorArr] = useState([]);
  const [curruntIdx, setCurrentIdx] = useState(0);
  const [count, setCount] = useState(0);
  // const token = getCookie("token")

  const TOTAL_SLIDES = 2;
  const slideRef = useRef(null);

  //슬라이드 넘기기
  const nextSlide = () => {
    if (curruntIdx >= TOTAL_SLIDES) {
      setCurrentIdx(0);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  //슬라이드 넘기기
  const prevSlide = () => {
    if (curruntIdx === 0) {
      setCurrentIdx(TOTAL_SLIDES);
    } else {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  //넘기는 모션
  useEffect(() => {
    slideRef.current.style.transition = `all 0.5s ease-in-out`;
    slideRef.current.style.transform = `translateX(-${curruntIdx}120px)`;
  }, [curruntIdx]);

  //탑10가져오기
  // useEffect(() => {
  //   setLoading(true)
  //     const getMark = async () => {
  //       if(!token){
  //         await apis.getBoardsLike(0)
  //                   .then((res)=>{
  //                       setContent(res.data.post.slice(0,10))

  //                     }).catch((e)=>{
  //                       console.log(e);
  //                     })
  //       }else{
  //         await apis.getBoardsLikeLogin(0)
  //                 .then((res)=>{
  //                     setContent(res.data.post.slice(0,10))
  //                   }).catch((e)=>{
  //                     console.log(e);
  //                   })
  //     }
  //                   }
  //                 getMark()
  //               }, [loading])

  useEffect(() => {
    const getHotEditor = axios
      .get(editorchoice + "/home")
      .then((resList) => {
        console.log("editorArr", resList.data);
        setHotEditorArr(resList.data);
        setCount(resList.data.length);
      })
      .catch((error) => {
        if (error.res) {
          console.log(error.res);
          console.log("server responded");
          alert("axios 에러");
        } else if (error.request) {
          console.log("network error");
          alert("server 에러");
        } else {
          console.log(error);
        }
      });
  }, []);

  return (
    <>
      <ScWrap>
        <ScTop>
          <div>
            <div style={{ fontFamily: "SUIT ExtraBold", fontSize: "1.875em" }}>
              에디터 추천 Top 6
            </div>
          </div>
          <ScMoveButton style={{ display: "flex" }}>
            <div onClick={prevSlide}>
              <img src={left} alt="" />
            </div>
            <div onClick={nextSlide}>
              <img src={right} alt="" />
            </div>
          </ScMoveButton>
        </ScTop>

        <Container>
          <ImageBox ref={slideRef} count={count}>
            {hotEditorArr?.map((item, index) => (
              <img width="300px" key={index} src={item.editorImgUrl2} />
            ))}
          </ImageBox>
        </Container>
      </ScWrap>
    </>
  );
};

const ScWrap = styled.div`
  /* border: 1px solid black; */
  margin: 33px auto 62px;
  max-width: 1400px;
  width: 85%;
  height: 410px;
  background-color: #f4f1ff;
  border-radius: 20px;
  padding: 20px;
`;

const ScTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0 10px 30px;
  color: #2c278c;
`;
const ScMoveButton = styled.div`
  display: flex;
  margin: 3% 5% 0 0;
  gap: 24px;
`;
const Container = styled.div`
  max-width: 1150px;
  width: 100%;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
  /* position: relative; */
`;

const ImageBox = styled.ul`
  margin: 0 0 0 125px;
  padding: 0;
  width: 100%;
  display: flex;
  transition: ${(props) => (!props.count ? "" : "all 1s ease-in-out")};
  transform: ${(props) => "translateX(-" + props.count * 1100 + "px)"};
`;
const ImageList = styled.li`
  list-style: none;
`;

export default PopularBoard;
