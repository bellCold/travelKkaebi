package com.bitcamp.travelkkaebi.mapper;

import com.bitcamp.travelkkaebi.dto.ReviewResponseDTO;
import com.bitcamp.travelkkaebi.model.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.*;

import org.hibernate.annotations.Parameter;

import javax.websocket.server.PathParam;
import java.util.HashMap;
import java.util.List;

@Mapper
public interface ReviewMapper {

    List<ReviewResponseDTO> selectAllByPage(HashMap<String, Integer> pageMap);
    ReviewResponseDTO selectOne(int reviewId);

    int insert(ReviewDTO reviewDTO);

    int update(ReviewDTO reviewDTO);

    int delete(int reviewId);

    int viewPlus(int reviewId);

    int reviewCount();


}
