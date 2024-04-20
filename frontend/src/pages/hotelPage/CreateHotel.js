import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";

const CreateHotel = () => {
  const [name, setName] = useState();
  const [city, setCity] = useState();
  const [type, setType] = useState();
  const [coordinates, setCoordinates] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [detailedDescription, setDetailedDescription] = useState();
  const [closestTouristLocation, setClosestTouristLocation] = useState();
  const [
    distanceToClosestTouristLocation,
    setDistanceToClosestTouristLocation,
  ] = useState(0);
  const [manager, setManager] = useState();
  const [staff, setStaff] = useState();
  const [cityData, setCityData] = useState();
  const [hotelTypeData, setHotelTypeData] = useState();
  const [loading, setLoading] = useState(true);
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current === false) {
      const references = async () => {
        setLoading(true);
        try {
          const resp = await axiosWithInterceptors.get(
            "http://localhost:5000/api/v1/hotels/allcityrefs"
          );
          // console.log("hotels: ", resp.data.data);
          setCityData([...resp.data.data]);

          const resp2 = await axiosWithInterceptors.get(
            "http://localhost:5000/api/v1/hotels/allhoteltyperefs"
          );
          // console.log("hotels: ", resp.data.data);
          setHotelTypeData([...resp2.data.data]);

          setLoading(false);
        } catch (err) {
          if (err.response.data.message) {
            navigate('/handleerror', {state: {message: err.response.data.message, path: location.pathname}})
          } else {
            navigate('/somethingwentwrong')
          }
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
      const givenCoordinates = coordinates.split(",");
      let coordinatesToNumbers = [];
      coordinatesToNumbers.push(givenCoordinates[1] * 1);
      coordinatesToNumbers.push(givenCoordinates[0] * 1);
      console.log(coordinatesToNumbers);

      const staffList = staff.split(",");
      let staffArray = [];
      for (let i = 0; i < staffList.length; i++) {
        staffArray.push(staffList[i].trim());
      }
   
      const hotelLocation = {
        coordinates: [...coordinatesToNumbers],
        address,
      };

      const resp = await axiosWithInterceptors.post("http://localhost:5000/api/v1/hotels", {
        name,
        city,
        type,
        description,
        detailedDescription,
        hotelLocation,
        closestTouristLocation,
        distanceToClosestTouristLocation,
        manager,
        staff: staffArray,
      });
      console.log(resp.data.data);
      const newlyCreatedHotel = {...resp.data.data}
      let hotelsToDisplay = []
      hotelsToDisplay.push(newlyCreatedHotel)
      navigate("/searchhotelsresults", { state: {pathname, hotelsToDisplay} });
    } catch (err) {
      if (err.response.data.message) {
        navigate('/handleerror', {state: {message: err.response?.data?.message, path: location.pathname}})
      } else {
        navigate('/somethingwentwrong')
      }
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
        {!loading && (
          <form className="registerContainer" onSubmit={handleSubmit}>
            <h3 className="registerTitle">Provide hotel details</h3>

            <div className="registerDiv">
              <label htmlFor="hotelName">Hotel name:</label>
              <input
                id="hotelName"
                type="text"
                value={name || ""}
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
              <label htmlFor="coordinates">Hotel Location Coordinates:</label>
              <input
                id="coordinates"
                type="text"
                value={coordinates || []}
                onChange={(e) => setCoordinates(e.target.value)}
                autoComplete="off"
                placeholder="latitude, longitude"
              />
            </div>
            <div className="registerDiv">
              <label htmlFor="address">Hotel address:</label>
              <input
                id="address"
                type="text"
                value={address || ""}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="registerDiv">
              <label htmlFor="hotelDesc">Brief hotel description:</label>
              <textarea
                id="hotelDesc"
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                rows="5"
                cols="30"
              >
                {description || ""}
              </textarea>
            </div>
            <div className="registerDiv">
              <label htmlFor="hotelDesc">Detailed hotel description:</label>
              <textarea
                id="hotelDesc"
                onChange={(e) => setDetailedDescription(e.target.value)}
                autoComplete="off"
                rows="5"
                cols="30"
              >
                {detailedDescription || ""}
              </textarea>
            </div>
            <div className="registerDiv">
              <label htmlFor="touristLocation">
                Name of closest tourist location:
              </label>
              <input
                id="touristLocation"
                type="text"
                value={closestTouristLocation || ""}
                onChange={(e) => setClosestTouristLocation(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="registerDiv">
              <label htmlFor="distanceToTouristLocation">
                Distance (in miles) to closest tourist location:
              </label>
              <input
                id="distanceToTouristLocation"
                type="number"
                value={distanceToClosestTouristLocation}
                onChange={(e) =>
                  setDistanceToClosestTouristLocation(e.target.value)
                }
                autoComplete="off"
              />
            </div>
            <div className="registerDiv">
              <label htmlFor="hotelManager">Hotel manager:</label>
              <input
                id="hotelManager"
                type="text"
                value={manager || ""}
                onChange={(e) => setManager(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="registerDiv">
              <label htmlFor="hotelStaff">Hotel staff:</label>
              <input
                id="hotelStaff"
                type="text"
                value={staff || ""}
                onChange={(e) => setStaff(e.target.value)}
                autoComplete="off"
              />
            </div>

            <button
              className="signUpButton"
              disabled={
                !name ||
                !city ||
                !type ||
                !coordinates ||
                !address ||
                !description ||
                !detailedDescription ||
                !manager ||
                !staff
              }
            >
              Continue
            </button>
          </form>
        )}
      </>
    </div>
  );
};

export default CreateHotel;
