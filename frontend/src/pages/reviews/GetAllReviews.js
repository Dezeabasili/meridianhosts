import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const GetAllReviews = () => {
  const [reviewsList, setReviewsList] = useState();
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const reviews = async () => {
        setLoading(true);
        try {
          if (location.state) {
            setReviewsList(location.state);
          } else {
            const resp = await axiosWithInterceptors.get("https://meridianhosts.onrender.com/api/v1/reviews");
            console.log("reviews: ", resp.data.data);
            setReviewsList([...resp.data.data]);
          }

          setLoading(false);
        } catch (err) {
          if (err.response.data.message) {
            navigate("/handleerror", {
              state: {
                message: err.response.data.message,
                path: location.pathname,
              },
            });
          } else {
            navigate("/somethingwentwrong");
          }
        }
      };

      reviews();
    }
    return () => {
      runOnce.current = true;
    };
  }, []);

  return (
    <div>
      {loading ? (
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        <>
          {reviewsList.length > 0 ? (
            <>
              {reviewsList?.map((review) => {
                const yellowStars = review.rating;
                const whiteStar = 5 - review.rating;

                return (
                  <div key={review._id}>
                    <p>Review Id: {review._id}</p>
                    <p>
                      Hotel name:{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {review.hotel.name}
                      </span>
                    </p>
                    <p>
                      Customer name:{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {review.customer.name}
                      </span>
                    </p>
                    <p>
                      Review date:{" "}
                      {format(
                        new Date(review.createdAt),
                        "MMM/dd/yyyy,  hh:mm:ss bbb"
                      )}
                    </p>
                    <p>Review: {review.review}</p>
                    <div>
                      <span>Rating: </span>

                      {[...Array(yellowStars)].map((star, i) => (
                        <FontAwesomeIcon
                          icon={faStar}
                          size="sm"
                          className="fStar"
                          key={i}
                        />
                      ))}

                      {[...Array(whiteStar)].map((star, i) => (
                        <FontAwesomeIcon
                          icon={faStar}
                          size="sm"
                          className="fStarHover"
                          key={i}
                        />
                      ))}
                    </div>

                    <br />
                    <br />
                  </div>
                );
              })}
            </>
          ) : (
            <p>No review in the database !!!</p>
          )}
        </>
      )}
    </div>
  );
};

export default GetAllReviews;
