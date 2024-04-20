import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const CreateHotelType = () => {
 
  const [hotelType, setHotelType] = useState();
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const resp = await axiosWithInterceptors.post("http://localhost:5000/api/v1/hotels/createhoteltype", {
        hotelType  
      });
      console.log(resp.data.data);
      navigate("/hotels");
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
        <h3 className="registerTitle">Provide hotel type</h3>

        <div className="registerDiv">
          <label htmlFor="cityName">Hotel type:</label>
          <input
            id="cityName"
            type="text"
            value={hotelType || ''}
            onChange={(e) => setHotelType(e.target.value)}
            autoComplete="off"
          />
        </div>
        

        <button
          className="signUpButton"
          disabled={
            !hotelType
          }
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default CreateHotelType;
