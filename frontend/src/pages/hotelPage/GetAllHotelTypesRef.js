import { useEffect, useState, useRef } from "react";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import {RotatingLines} from 'react-loader-spinner'

const GetAllHotelTypesRef = () => {
  const [referenceList, setReferenceList] = useState();
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false)
  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const references = async () => {
        setLoading(true);
        try {
      
            const resp = await axiosWithInterceptors.get("http://localhost:5000/api/v1/hotels/allhoteltyperefs");
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
              {referenceList?.map((hotelType) => (
                <div key={hotelType._id}>
                  <p>Hotel Type: <span style={{"textTransform": "capitalize"}}>{hotelType.hotelType}</span></p>
                  <p>Hotel Type reference: {hotelType._id}</p>                 
                  <br />
                </div>
              ))}
            </>
          ) : (
            <p>No hotel type in the database !!!</p>
          )}
        </>
      )}
    </div>
  );
};

export default GetAllHotelTypesRef;


