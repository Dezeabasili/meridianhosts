import { useEffect, useState, useRef } from "react";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import {RotatingLines} from 'react-loader-spinner'

const GetAllHotelCityRefs = () => {
  const [referenceList, setReferenceList] = useState();
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false)

  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const references = async () => {
        setLoading(true);
        try {
      
            const resp = await axiosWithInterceptors.get("https://meridianhosts.onrender.com/api/v1/hotels/allcityrefs");
            // console.log("hotels: ", resp.data.data);
            setReferenceList([...resp.data.data]);
         
  
          setLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      };
  
      references();
    }

    return () => {
      runOnce.current = true
    }

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
          {referenceList.length > 0 ? (
            <>
              {referenceList?.map((city) => (
                <div key={city._id}>
                  <p>City name: <span style={{"textTransform": "capitalize"}}>{city.cityName}</span></p>
                  <p>City reference: {city._id}</p>                                  
                  <br />
                </div>
              ))}
            </>
          ) : (
            <p>No hotel city in the database !!!</p>
          )}
        </>
      )}
    </div>
  );
};

export default GetAllHotelCityRefs;


