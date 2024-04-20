import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const GetAllBookingsForAHotel = () => {
  const [hotelRef, setHotelRef] = useState();
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation()
  const pathname = location.pathname

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axiosWithInterceptors.get(
        `http://localhost:5000/api/v1/bookings?hotel_id=${hotelRef}`
      );
      console.log(resp.data.data);
      const bookingsToDisplay = [...resp.data.data]
      navigate("/searchbookingsresults", { state: {pathname, bookingsToDisplay} });
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
        <h3 className="registerTitle">
          Provide the hotel reference
        </h3>

        <div className="registerDiv">
          <label htmlFor="hotelRef">Hotel reference:</label>
          <input
            id="hotelRef"
            type="text"
            value={hotelRef}
            onChange={(e) => setHotelRef(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button className="signUpButton" disabled={!hotelRef}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default GetAllBookingsForAHotel;
