import React, { useState, useEffect } from "react";

import Axios from "axios";
import SingleComment from "./SingleComment";

/*
  댓글 영역
*/
const Comment = ({ postId }) => {
  const [list, setList] = useState([]);
  const [writeComment, setWriteComment] = useState("");
  const [updateView, setUpdateView] = useState(false);
  const [updateId, setUpdateId] = useState("");
  /*
    componentWillMount
  */
  useEffect(() => {
    // 최초 출력
    commentList();
  }, []);

  /*
    댓글 list 갱신 (+재출력)
  */
  const commentList = () => {
    const url = `http://localhost:9000/mechelin/comment/getcomments?post_id=${postId}`;
    Axios.get(url)
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
    댓글 좋아요 클릭 시 실행(SingleComment 와 바인드)
  */
  const onCommentLike = (e) => {
    const url = `http://localhost:9000/mechelin/likes/comment`;
    Axios.post(url, {
      comment_id: e.target.getAttribute("commentId"),
      user_id: e.target.getAttribute("userId"),
    })
      .then((response) => {
        // 재출력
        commentList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /*
    댓글 삭제 클릭 시 실행(SingleComment 와 바인드)
  */
  const onCommentDelete = (e) => {
    const url =
      `http://localhost:9000/mechelin/comment/deletecomment` +
      `?comment_id=${e.target.getAttribute("commentId")}`;
    Axios.get(url)
      .then((response) => {
        // 재출력
        commentList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
    댓글 추가
  */
  const commentInsert = (postId, userId) => {
    const url = `http://localhost:9000/mechelin/comment/insertcomment`;
    Axios.post(url, {
      user_id: userId,
      post_id: postId,
      content: writeComment,
    })
      .then((response) => {
        setWriteComment("");
        commentList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
    댓글 수정 내용+버튼 표시
  */
  const setCommentUpdate = (e) => {
    setUpdateView(true);
    setUpdateId(e.target.getAttribute("commentId"));
    setWriteComment(e.target.getAttribute("content"));
  };

  /*
    댓글 수정 제출
  */
  const onCommentUpdate = () => {
    const url = `http://localhost:9000/mechelin/comment/updatecomment`;
    Axios.post(url, {
      id: updateId,
      content: writeComment,
    })
      .then((response) => {
        setWriteComment("");
        commentList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {/* 단일 댓글 하나씩 import */}
      {[...list].map((item, i) => {
        return (
          <SingleComment
            item={item}
            i={i}
            cLikeChange={onCommentLike}
            cUpdateClick={setCommentUpdate}
            cDeleteChange={onCommentDelete}
          />
        );
      })}
      {/* 새 댓글 작성 영역 */}
      <tr>
        <td>
          <img alt="" />
          프로필사진
        </td>
        <td colSpan="3">
          <input
            type="text"
            value={writeComment}
            onInput={(e) => setWriteComment(e.target.value)}
          />
          {/* 댓글수정 시 내용변경 */}
          {updateView ? (
            <button type="button" onClick={(e) => onCommentUpdate()}>
              수정
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                commentInsert(postId, sessionStorage.getItem("userId"))
              }
            >
              작성
            </button>
          )}
        </td>
      </tr>
    </div>
  );
};
export default Comment;