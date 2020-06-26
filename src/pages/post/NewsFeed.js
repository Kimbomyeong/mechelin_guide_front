import React from "react";
import Axios from "util/axios";
import Comment from "pages/post/Comment";
import "css/postStyle.css";
import { Button } from "antd";
var nowTime = (data) => {
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
//import Comment from "pages";
class NewsFeed extends React.Component {
  constructor({ props }) {
    super(props);
    this.state = {
      Data: [],
      time: "",
      row: sessionStorage.getItem("userId"),
      realTime: "",
      heart: "",
    };
  }
  componentWillMount() {
    this.getAllPost();
    this.props.getState(false);
    console.log("현재날짜:" + this.state.realTime);
  }

  /*포스트 내용 가져오기 */
  getAllPost = () => {
    let url =
      "/post/newsfeed/getallpost?user_id=" +
      sessionStorage.getItem("userId") +
      "&row=" +
      0;
    //this.state.row;
    Axios.get(url)
      .then((res) => {
        console.log(res.data);

        this.setState({
          Data: res.data,
        });
        console.log(this.state.Data);
      })
      .catch((err) => {
        console.log("getAllPost error:" + err);
      });
  };

  //게시글 올린 날짜(현재시간 기준으로 얼마나 지났는지 표시)
  nowTime = () => {
    // parse a date in yyyy-mm-dd format
    const parseDate = (input) => {
      var parts = input.match(/(\d+)/g);
      // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
      var createAt = new Date(
        parts[0],
        parts[1] - 1,
        parts[2],
        parts[3],
        parts[4]
      ); // months are 0-based
      return createAt;
    };

    let now = new Date();
    let createAt = parseDate(this.state.realTime);
    let timeDiff = now.getTime() - createAt.getTime();
    timeDiff /= 1000 * 60;

    if (isNaN(timeDiff) || timeDiff < 0) return;

    let simpleTime = "";
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
    this.setState({
      time: simpleTime,
    });
  };
  clickHeart = () => {
    if (this.state.heart) {
      this.setState({
        heart: false,
      });
    } else {
      this.setState({
        heart: true,
      });
    }
  };
  render() {
    return (
      <div>
        <div className="sideMenu">뉴스피드</div>
        <Button type="primary">테스트</Button>
        <div type="primary">테스트</div>
        <Button type="success">테스트</Button>
        <Button type="error">테스트</Button>
        <div className="list">
          {this.state.Data.map((row, idx) => (
            <form>
              <table className="postTable">
                <thead>
                  <tr>
                    <th colSpan="2" style={{ fontWeight: "bold" }}>
                      {row.name}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ width: "5vw", paddingRight: "0" }}>
                      프로필 사진
                      <img src={row.profile_url} alt="" />
                    </th>
                    <th>
                      {row.nickname}
                      <br />
                      {this.state.realTime}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2">
                      제목:{row.subject}{" "}
                      <div style={{ float: "right" }}>{row.rating}점</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      내용:
                      <span
                        dangerouslySetInnerHTML={{ __html: row.content }}
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div
                        className={this.state.heart ? "xi-heart-o" : "xi-heart"}
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        onClick={this.clickHeart.bind(this)}
                      ></div>
                      {row.likes}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Comment postId={row.id} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          ))}
        </div>
      </div>
    );
  }
}
export default NewsFeed;
