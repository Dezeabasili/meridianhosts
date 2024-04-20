import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";

const UpdateHotel = () => {
  const [name, setName] = useState();
  const [city, setCity] = useState();
  const [type, setType] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [manager, setManager] = useState();
  const [addStaff, setAddStaff] = useState();
  const [removeStaff, setRemoveStaff] = useState();
  const [cityData, setCityData] = useState();
  const [hotelTypeData, setHotelTypeData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation()
  const runOnce = useRef(false);

  const errorDiv = error ? <div className="error">{error}</div> : "";

  useEffect(() => {
    if (runOnce.current === false) {
      const references = async () => {
        setLoading(true);
        setError(null);
        try {
          const resp = await axiosWithInterceptors.get("https://meridianhosts.onrender.com/api/v1/hotels/allcityrefs");
          // console.log("hotels: ", resp.data.data);
          setCityData([...resp.data.data]);

          const resp2 = await axiosWithInterceptors.get(
            "https://meridianhosts.onrender.com/api/v1/hotels/allhoteltyperefs"
          );
          // console.log("hotels: ", resp.data.data);
          setHotelTypeData([...resp2.data.data]);

          setLoading(false);
        } catch (err) {
          console.log(err.message);
          setError(err.response.data.message);
        }
      };

      references();
    }

    return () => {
      runOnce.current = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await axiosWithInterceptors.patch(
        `https://meridianhosts.onrender.com/api/v1/hotels/${location.state}`,
        { name, city, type, address, description, manager, addStaff, removeStaff }
      );
      // console.log(resp.data.data);
      navigate(`/hotels/${location.state}`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
    }
  };

  
  const handleSelectChange = (e) => {
    setCity(e.target.value);
  };
  const handleSelectChange2 = (e) => {
    setType(e.target.value);
  };

  return (
    <div className="register">
      <>
        {loading && (
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
        )}
      </>
      <>
          {!loading && <form className="registerContainer" onSubmit={handleSubmit}>
        <h3 className="registerTitle">
          Provide only the hotel information to change 
        </h3>

        <div className="registerDiv">
          <label htmlFor="hotelName">Hotel name:</label>
          <input
            id="hotelName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        
        <div className="registerDiv">
              <label htmlFor="city">Select a city:</label>
              <select id="city" onChange={handleSelectChange}>
                <option
                  style={{ textTransform: "capitalize" }}
                  value={""}
                  onClick={() => setCity(null)}
                >
                  --Please select an option--
                </option>
                {cityData?.map((selectedCity) => (
                  <option
                    style={{ textTransform: "capitalize" }}
                    key={selectedCity._id}
                    value={selectedCity._id}
                  >
                    {selectedCity.cityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="registerDiv">
              <label htmlFor="hoteltype">Select a hotel type:</label>
              <select id="hoteltype" onChange={handleSelectChange2}>
                <option
                  style={{ textTransform: "capitalize" }}
                  value={""}
                  onClick={() => setType(null)}
                >
                  --Please select an option--
                </option>
                {hotelTypeData?.map((selectedType) => (
                  <option
                    style={{ textTransform: "capitalize" }}
                    key={selectedType._id}
                    value={selectedType._id}
                  >
                    {selectedType.hotelType}
                  </option>
                ))}
              </select>
            </div>
  
 
        <div className="registerDiv">
          <label htmlFor="hotelAddress">Hotel address:</label>
          <input
            id="hotelAddress"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="hotelDesc">Hotel description:</label>
          <textarea
            id="hotelDesc"
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
            rows="5"
            cols="30"
          >
            {description}
          </textarea>
        </div>
        <div className="registerDiv">
          <label htmlFor="hotelManager">Hotel Manager:</label>
          <input
            id="hotelManager"
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="hotelStaff">Add one or more staff:</label>
          <input
            id="hotelStaff"
            type="text"
            value={addStaff}
            onChange={(e) => setAddStaff(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="hotelStaff2">Remove one or more staff:</label>
          <input
            id="hotelStaff2"
            type="text"
            value={removeStaff}
            onChange={(e) => setRemoveStaff(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button className="signUpButton" disabled={!name && !city && !type && !address && !description && !manager && !addStaff && !removeStaff}>
          Continue
        </button>
      </form>}
      </>
      <>
      {error && errorDiv}
      </>
      
    </div>
  );
};

export default UpdateHotel;
