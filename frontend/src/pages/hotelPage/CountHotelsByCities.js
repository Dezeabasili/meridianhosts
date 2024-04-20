import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";

const CountHotelsByCities = () => {
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState();
  const runOnce = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (runOnce.current === false) {
      const displayData = async () => {
        setLoading(true);
        try {
          const resp = await axios.get("https://meridianhosts.onrender.com/api/v1/hotels/countbycity");
          // console.log(resp.data.data);
          setHotelData([...resp.data.data]);
          setLoading(false);
        } catch (err) {
          if (err.response.data.message) {
            navigate("/handleerror", {
              state: {
                message: err.response?.data?.message,
                path: location.pathname,
              },
            });
          } else {
            navigate("/somethingwentwrong");
          }
        }
      };

      displayData();
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
          {hotelData.map((city) => (
            <div key={city.cityName}>
              <h5>
                <span style={{ textTransform: "capitalize" }}>
                  {city.cityName}
                </span>
              </h5>
              <p>
                {city.numberOfHotels}{" "}
                {city.numberOfHotels == 1 ? "property" : "properties"}
              </p>
              <br />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CountHotelsByCities;
