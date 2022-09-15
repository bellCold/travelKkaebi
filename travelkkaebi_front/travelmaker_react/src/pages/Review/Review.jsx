import React from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import styled from 'styled-components';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SplitButton from 'react-bootstrap/SplitButton';
import usePagination from '@mui/material/usePagination';
import Paging from '../../components/Pagination/Paging';

import banner from './/banner.jpg';
import b1b from './/smallBanner.jpg';

function Review() {

  const [show, setShow] = useState(1);
  const [count, setCount] = useState(0);

  const [data, setData] = useState([]);
  const navi = useNavigate();

  // 현재 페이지 번호
  const { currentPage, setCurrentPage } =  useParams();

  // search
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectKeyword, setSelectKeyword] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();
    setSearchKeyword(e.target.value);
  };

  const selectChange = (e) => {
    e.preventDefault();
    setSelectKeyword(e.target.value);
  };

  const onSearch = (e) => {
    if (
      searchKeyword === null ||
      searchKeyword === "" ||
      selectKeyword === "선택하기🎇"
    ) {
      return () => {
        const fetchPost = async () => {
          setCurrentPage();
          const fetchAxios = await axios
            .get(API_BASE_URL + "?pageNo=" + currentPage) //,{params:{pageNo:currentPage}}
            .then((res) => {
              console.log(res.data);
              setData(res.data.list);
              console.log("list : ", res.data.list);
              setCount(res.data.count);
              console.log("totalBoardCount", res.data.count);
            });
        };
      };
    } else if (selectKeyword === "제목") {
      searchTitle();
    } else if (selectKeyword === "닉네임") {
      searchName();
    } else if (selectKeyword === "내용") {
      searchContent();
    } else if (selectKeyword === "지역") {
      searchRegion();
    } else {
      alert("무슨 오류일까요요요요요용~?");
      return;
    }
  };

  const searchTitle = async () => {
    await axios
      .get(API_BASE_URL+ "/review/selectallbypage/searchbytitle", {
        params: { pageNo: currentPage, title: searchKeyword },
      })
      .then((res) => {
        if (searchKeyword == null) {
          return res;
        }
        console.log(res);
        setData(res.data.list);
        setCount(res.data.count);
        console.log("totalBoardCount", res.data.count);
      });
  };

  const searchName = async () => {
    await axios
      .get(API_BASE_URL+ "/review/selectallbypage/searchbywriter", {
        params: { pageNo: currentPage, writer: searchKeyword },
      })
      .then((res) => {
        console.log(res);
        setData(res.data.list);
        setCount(res.data.count);
        console.log("totalBoardCount", res.data.count);
      });
  };

  const searchContent = async () => {
    await axios
      .get(API_BASE_URL+ "/review/selectallbypage/searchbycontent", {
        params: { pageNo: currentPage, content: searchKeyword },
      })
      .then((res) => {
        console.log(res);
        setData(res.data.list);
        setCount(res.data.count);
        console.log("totalBoardCount", res.data.count);
      });
  };
  
  const searchRegion = async () => {
    await axios
      .get(API_BASE_URL+ "/review/selectallbypage/keywordbyregion", {
        params: { pageNo: currentPage, region: searchKeyword },
      })
      .then((res) => {
        console.log(res);
        setData(res.data.list);
        setCount(res.data.count);
        console.log("totalBoardCount", res.data.count);
      });
  };



  // url선언 (미사용)
  let pagelistUrl = process.env.REACT_APP_SPRING_URL + 'review/pagelist?currentPage=' + currentPage;
  let photoUrl  = process.env.REACT_APP_SPRING_URL + 'save/';

  // 시작시 호출되는 함수
  const pageList=()=>{
    axios.get(API_BASE_URL+"/review/selectallbypage",
    {params : {
      pageNo : currentPage }
    })
    .then(res=>{
      setData(res.data);
      console.log(res.data);
    })
  }

  const pageCount=()=>{
    axios.get(API_BASE_URL+"/review/count",
    )
    .then(response=>{
      setCount(response.data);
    })
  }



        // 멀티 액시오스 시도한거

      // const getDetail=()=>{
      //   axios
      //   .all([axios.get(API_BASE_URL+"/review/selectone"),{params : { reviewId : id }}, axios.get(API_BASE_URL+"/review/reply/selectbyreview"),{params : {reviewId : id}}])
      //   .then(
      //     axios.spread((response1, response2)=>{
      //       console.log(response1, response2);
      //     })
      //   )
      //   .catch((err)=>console.log(err));
      // }


  useEffect(()=>{
    pageList();
    pageCount();
  },[currentPage]);// currentPage가 변경될 때마다 다시 호출


  return(
    
    
    <div style={{}}>

<ScTopCard style={{marginBottom:"50px"}}>
            <ScLogo1 alt='' src={banner} style={{ width: "100%" }} />
            <ScLogo2 alt='' src={b1b} style={{ width: "100%" }} />
              <ScMainTitle>여기 정말 좋았어요!</ScMainTitle>
              <Scwrite
                onClick={() => {
                  navi("/review/createform");
                }}
              >
                {/* <img src={b2b} alt='' /> */}
                <span>글 작성하기</span>
              </Scwrite>
        </ScTopCard>  

      <div style={{marginTop:"50px"}}>
        <div style={{width:"700px", margin:"auto"}}>
        <a href="/review/1" align="left" style={{fontFamily:"'NanumBarunGothic', 'Malgun Gothic', dotum, sans-serif", fontSize:"30px", color:"#548235" , marginBottom:'10px', textDecorationLine : 'none'}}>유저 리뷰 게시판</a>
        <hr style={{backgroundColor : '#548235', height:'3px'}}/>
        </div>
        <h3 className='alert alert-info' style={{ width:'700px', marginTop: 90, margin: 'auto' }}>
          총 {count} 개의 게시글이 있습니다
        </h3>
        <br/>
        <table className='table table-bordered' style={{ width:'700px', margin: 'auto' }}>
          <thead>
            <tr style={{ backgroundColor:'#ddd' }}>
              <th width='50'>번호</th>
              <th width='400' style={{ textAlign:'center' }}>제목</th>
              <th width='80'>작성자</th>
              <th width='50'>조회</th>
            </tr>
          </thead>
          <tbody>
          {
            /* https://maggie-a.tistory.com/220 TypeError: Cannot read property 'map' of null
            */
            data && data.map((row, idx)=>(
              <tr>
                <td key={row.reviewId}>{row.reviewId}</td>
                <td onClick={()=>{
                  navi(`/review/detail/${row.reviewId}`)
                }} style={{ cursor:'pointer' }}>
                  {row.title}
                </td>
                <td>{row.nickname}</td>
                <td>{row.view}</td>
              </tr>
            ))
          }
          </tbody>
        </table>

        {/* 페이징 */}
        <div style={{ width:'700px', margin:'auto' }}>
          {}

          <Paging count={count} />
          
        </div>




          
        <div style={{ width:'700px', textAlign:'right', margin:'auto', display:'flex' }}>
          <div style={{ width:'100%', marginTop:'10px' }}>
          <div>
            <select id="searchKey" name="searchKey" onChange={selectChange}>
              <option value="선택하기🎇">--</option>
              <option value="제목">제목</option>
              <option value="닉네임">닉네임</option>
              <option value="내용">내용</option>
              <option value="지역">지역</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              name="SearchKeyword"
              value={searchKeyword || ""}
              onChange={searchHandler}
            />
            <button onClick={onSearch}>검색</button>
          </div>
          </div>

          <div style={{ width:'300px' }}>
          {/* <button type='button' className='btn btn-info'
          style={{ width:'110px', marginTop:'10px' }}
          onClick={()=>{
            navi("/review/createform");
          }}>글쓰기</button> */}

          <div className='list-icon'>
            <span className='glyphicon glyphicon-th-list bicon' 
            style={{ color:show===1?'green':'magenta' }}
            onClick={()=>{
              setShow(1);
            }}></span>
            <span className='glyphicon glyphicon-th-large'
            style={{ color:show===2?'green':'magenta' }}
            onClick={()=>{
              setShow(2);
            }}></span>
            <span className='glyphicon glyphicon-list-alt'
            style={{ color:show===3?'green':'magenta' }}
            onClick={()=>{
              setShow(3);
            }}></span>
          </div>

          </div>

        <div>
          {
            // show===1?<BoardList1/>:show===2?<BoardList2/>:<BoardList3/>
          }
        </div>
      </div>
      
      </div>

      
    </div>
  );
}

export default Review;

const ScTopCard = styled.div`
  width: 100%;
  display: flex;
  background-color:#F5EABB;
  width: 100%;
  position: relative;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 0px;
    margin: 30px auto;
  }
`;

const ScLogo1 = styled.img`
@media screen and (max-width: 768px) {
  display: none;
}
`
const ScLogo2 = styled.img`
display: none;
@media screen and (max-width: 768px) {
  display: block;
  }
`

const ScTopCard2 = styled.div`
  width: 100%;
  display: flex;
  font-size: 1.5em;
  margin-bottom: 30px;  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 0px;
    margin: auto;
    div{
      display: none;
    }
  }
`;

const ScMainTitle = styled.div`
  font-weight: 900;
  font-size: 2.125em;
  /* line-height: 43px; */
  margin-bottom: 20px;
  /* font-family: "SUIT ExtraBold"; */
  position: absolute;
  top:50%;
  right: 20%;
  @media screen and (max-width: 1200px) {
  font-size: 28px;
  right: 20%;
   /* display: none; */
  }
  @media screen and (max-width: 768px) {
  font-size: 16px;
  right: 20%;
  display: none;
  }
`;
const Scwrite = styled.div`
  position: absolute;
  top:64%;
  right: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  font-weight: 500;
  text-align: center;
  color: white;
  width: 166px;
  height: 49px;
  font-size: 1.25em;
  border-radius: 10px;
  gap:7px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
  position: absolute;
  font-size: 12px;
  width: 86px;
  height: 30px;
  right: 10%;
  top:30%;
    img{
      display: none;
    }
  }
  
`;