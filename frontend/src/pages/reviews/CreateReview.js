import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import Stars from "../../components/starRating/Stars";

const CreateReview = () => {
  const [bookingRef, setBookingRef] = useState();
  const [review, setReview] = useState();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('ratings: ', rating)
      const resp = await axiosWithInterceptors.post("http://localhost:5000/api/v1/reviews", {
        bookingRef,
        rating,
        review
      });
      console.log(resp.data.data);
      navigate("/myreviews");
    } catch (err) {
      if (err.response.data.message) {
        navigate('/handleerror', {state: {message: err.response.data.message, path: location.pathname}})
      } else {
        navigate('/somethingwentwrong')
      }
    }
  };

  return (
    <div className="register">
      <form className="registerContainer" onSubmit={handleSubmit}>
        <h3 className="registerTitle">Provide hotel details</h3>

        <div className="registerDiv">
          <label htmlFor="hotelRef">Booking reference:</label>
          <input
            id="hotelRef"
            type="text"
            value={bookingRef}
            onChange={(e) => setBookingRef(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            onChange={(e) => setReview(e.target.value)}
            autoComplete="off"
            rows="5"
            cols="30"
          >
            {review}
          </textarea>
        </div>
        <div className="registerDiv">
          <label htmlFor="rating">Rating:</label>
          <Stars rating={rating} setRating={setRating} hover={hover} setHover={setHover} />
        </div>

        <button
          className="signUpButton"
          disabled={
            !review ||
            !rating ||
            !bookingRef 
          }
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
