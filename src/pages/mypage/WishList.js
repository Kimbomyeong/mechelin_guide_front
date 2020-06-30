import React, { useState, useEffect } from "react";
import WishlistComponent from "components/wishlist/Wishlist";
import WishListMap from "components/map/WishListMap";
import Axios from "util/axios";

const WishList = (props) => {
  const perPageNum = 5;
  const [pageStart, setPageStart] = useState(0);
  const [totalcount, setTotalCount] = useState("");
  const [render, setRender] = useState("");
  const [result, setResult] = useState([]);

  useEffect(() => {
    props.getState(false);
    const url = `wishlist/totalcount?user_id=${sessionStorage.getItem(
      "userId"
    )}`;
    Axios.get(url)
      .then((res) => {
        console.log(res.data);
        setTotalCount(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const url = `/wishlist/pagedata?user_id=${sessionStorage.getItem(
      "userId"
    )}&pageStart=${pageStart}&perPageNum=${perPageNum}`;
    Axios.get(url)
      .then((res) => {
        console.log(res.data);
        setResult(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageStart]);

  const onChangePage = (value) => {
    console.log(value);
    setPageStart((value - 1) * perPageNum);
    //pageStart = value * 5 - 1;
    console.log(pageStart);
    setRender(render + 1);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: "300px",
          marginLeft: "100px",
        }}
      >
        <WishlistComponent
          onChangePage={onChangePage}
          totalcount={totalcount}
          result={result}
          perPageNum={perPageNum}
        />
      </div>
      <div
        style={{
          border: "1px solid black",
          width: "800px",
          height: "650px",
          position: "absolute",
          marginTop: "150px",
          marginLeft: "600px",
        }}
      >
        <WishListMap
          result={result}
          history={props.history}
          reivewPageMove={props.reivewPageMove}
        />
      </div>
    </div>
  );
};
export default WishList;
