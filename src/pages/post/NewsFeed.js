import React, { useState, useEffect } from "react";
import Axios from "util/axios";
import Comment from "./Comment";
import "css/postStyle.css";
import useIntersect from "components/review/useIntersect";
import heart from "images/heart.png";
import heart_o from "images/heart_o.png";
import star from "images/star.png";
import share from "images/share2.png";
import star_g from "images/star_g.png";
import e from "cors";
import { Rate, Modal } from "antd";

const fakeFetch = (delay = 1000) =>
  new Promise((res) => setTimeout(res, delay));

const ListItem = ({ row, i, likesChange, wishClick }) => {
  useEffect(() => {
    if (row.user_id === sessionStorage.getItem("userId")) {
      setShowBtn(true);
    }
  }, []);

  const [showBtn, setShowBtn] = useState(false);
  const [checkHeart, setCheckHeart] = useState(false);

  const nowTime = (data) => {
    let now = new Date().getTime();
    let date = new Date(0).setUTCSeconds(data) / 1000;
    let timeDiff = (now - date) / (1000 * 60);

    if (isNaN(timeDiff) || timeDiff < 0) return;

    let simpleTime;
    if (timeDiff < 1) {
      simpleTime = "방금 전";
    } else if (timeDiff < 60) {
      simpleTime = parseInt(timeDiff) + "분 전";
    } else if (timeDiff < 60 * 24) {
      simpleTime = parseInt(timeDiff / 60) + "시간 전";
    } else if (timeDiff < 60 * 24 * 30) {
      simpleTime = parseInt(timeDiff / (60 * 24)) + "일 전";
    } else if (timeDiff < 60 * 24 * 30 * 12) {
      simpleTime = parseInt(timeDiff / (60 * 24 * 30)) + "달 전";
    } else {
      simpleTime = parseInt(timeDiff / (60 * 24 * 30 * 12)) + "년 전";
    }

    return `${simpleTime}`;
  };

  const test = (e) => {
    console.dir(e.target);
    const url = `/likes/ispost?id=${sessionStorage.getItem("userId")}&post_id=${
      row.id
    }`;
    Axios.get(url)
      .then((res) => {
        console.log("1:" + res.data);
        if (res == "1") {
          // e.target.setAttribute("src", heart);
          e.target.src = heart;
        } else {
          e.target.setAttribute("src", heart);
        }
      })
      .catch((error) => {
        console.log("heartBoolean" + error);
      });
  };

  /*좋아요 눌렀는지 확인 */
  const heartBoolean = () => {
    const url = `/likes/ispost?id=${sessionStorage.getItem("userId")}&post_id=${
      row.id
    }`;
    Axios.get(url)
      .then((res) => {
        console.log("1:" + res.data);
        return res.data;
      })
      .catch((error) => {
        console.log("heartBoolean" + error);
      });
    return 1;
  };
  return (
    <div>
      <form>
        <table className="postTable">
          <thead>
            <tr style={{ backgroundColor: "rgba(245, 145, 45, 0.2)" }}>
              <th
                colSpan="4"
                style={{
                  fontWeight: "bold",
                }}
              >
                {" "}
                {row.subject}{" "}
              </th>
              <th
                style={{
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {row.name}
              </th>
            </tr>
            <tr>
              <th
                style={{
                  paddingRight: "0",
                  width: "65px",
                }}
              >
                <img
                  src={row.profile_url}
                  alt=""
                  style={{
                    width: "3vw",
                    borderRadius: "50%",
                    height: "3vw",
                  }}
                />
              </th>
              <th colspan="3" style={{ paddingLeft: "10px" }}>
                {row.nickname}
                <br />
                {nowTime(row.created_at)}
              </th>
              <th>
                <div style={{ float: "right" }}>
                  <Rate
                    allowHalf
                    value={row.rating}
                    disabled="disabled"
                    style={{
                      pointerEvents: "none",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5">
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: row.content }}
                ></div>
              </td>
            </tr>
            <tr>
              <td colSpan="5">
                <div
                  style={{
                    height: "30px",
                    width: "100%",
                    lineHeight: "30px",
                    marginBottom: "10px",
                  }}
                >
                  {heartBoolean() === 1 ? (
                    <img
                      src={heart}
                      alt=""
                      width="30"
                      height="27"
                      onClick={heartBoolean}
                      postId={row.id}
                      style={{
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                    />
                  ) : (
                    <img
                      src={heart_o}
                      alt=""
                      width="30"
                      height="27"
                      onClick={heartBoolean}
                      postId={row.id}
                      style={{
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                    />
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      color: "#999",
                      fontSize: "15px",
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  >
                    {row.likes}
                  </span>
                  <img
                    src={share}
                    width="30"
                    height="30"
                    alt=""
                    style={{ cursor: "pointer", float: "right" }}
                  />

                  <img
                    src={star}
                    width="28.5"
                    height="28.5"
                    alt=""
                    style={{
                      float: "right",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={wishClick}
                    placeId={row.place_id}
                    postId={row.id}
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    borderBottom: "1px solid rgba(0,0,0,.2) ",
                    textAlign: "center",
                    marginBottom: "-25px",
                    clear: "both",
                  }}
                ></div>
              </td>
            </tr>{" "}
            <tr>
              <td colSpan="5">
                <Comment postId={row.id} />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

let item = 5;
let dataLength = 0;
let theposition;
let userPlaceId;
let likes = "";
const NewsFeed = (props) => {
  const [state, setState] = useState({ itemCount: 3, isLoading: false });
  const [result, setResult] = useState([]);
  const [theposition, setTheposition] = useState("");
  const [likes, setLikes] = useState(false);
  console.log("state구역");
  /* fake async fetch */
  const fetchItems = async () => {
    const url = `/post/newsfeed/getallpost?user_id=${sessionStorage.getItem(
      "userId"
    )}&row=${item}`;
    Axios.get(url)
      .then((response) => {
        console.log(response.data);
        console.log(`item : ${item}`);
        setResult(response.data);
        console.log(response.data.length);
        dataLength = response.data.length;
        item = dataLength;
      })
      .catch((error) => {
        console.log(error);
      });

    setState((prev) => ({ ...prev, isLoading: true }));
    await fakeFetch();
    setState((prev) => ({
      itemCount: prev.itemCount + 5,
      isLoading: false,
    }));
    item += 5;
  };
  /* initial fetch */
  useEffect(() => {
    fetchItems();
    props.getState(false);
  }, []);
  const [_, setRef] = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    await fetchItems();
    observer.observe(entry.target);
  }, {});
  const { itemCount, isLoading } = state;
  if (!itemCount) return null;

  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;

    setTheposition(scrolled);
  };
  /*
   * 공감 버튼 클릭시 실행되는 메소드
   */
  const onClickLikes = (e) => {
    console.log(sessionStorage.getItem("userId"));
    const url = `/likes/post`;
    Axios.post(url, {
      user_id: sessionStorage.getItem("userId"),
      post_id: e.target.getAttribute("postId"),
    })
      .then((response) => {
        console.log(response.data);
        onClickLikesRender();
      })
      .catch((error) => {
        console.log("onClickLikes" + error);
      });
  };
  /*
   *  공감 버튼을 눌렀을때 바로 반영될 수 있게 하는 메소드
   */
  const onClickLikesRender = () => {
    console.log(item);
    item = dataLength;
    console.log(item);
    const url = `/post/newsfeed/getallpost?user_id=${sessionStorage.getItem(
      "userId"
    )}&row=${item}`;
    Axios.get(url)
      .then((response) => {
        setResult(response.data);
        item += 5;
      })
      .catch((error) => {
        console.log("onClickLikesRender" + error);
      });
  };
  /*
   * 위시리스트 버튼 클릭 시
   */
  const wishClick = (e) => {
    const url = `/wishlist/add`;
    Axios.post(url, {
      user_id: sessionStorage.getItem("userId"),
      place_id: e.target.getAttribute("placeId"),
      post_id: e.target.getAttribute("postId"),
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === "위시리스트에 추가 되었습니다!") {
          success(res.data);
        } else {
          info(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function success(str) {
    Modal.success({
      content: str,
    });
  }

  function info(str) {
    Modal.info({
      title: str,
      content: (
        <div>
          <p>위시리스트 혹은 리뷰글이 등록된 맛집입니다.</p>
        </div>
      ),
      onOk() {},
    });
  }
  return (
    <div>
      <div
        className="App"
        style={{
          overflow: "auto",
          height: "100vh",
        }}
      >
        {[...result].map((contact, i) => {
          return (
            <ListItem
              row={contact}
              i={i}
              likesChange={onClickLikes}
              wishClick={wishClick}
            />
          );
        })}
        <div ref={setRef} className="Loading">
          {isLoading && "Loading..."}
        </div>
      </div>
    </div>
  );
};
export default NewsFeed;
