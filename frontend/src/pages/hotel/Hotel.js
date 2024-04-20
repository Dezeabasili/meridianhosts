import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Subscription from "../../components/subscription/Subscription";
import "./hotel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../context/authContext";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import ReserveRoom from "../../components/reserveRoom/ReserveRoom";
import { baseURL } from "../../context/authContext";
import {RotatingLines} from 'react-loader-spinner'

const Hotel = () => {
  const ref2 = useRef([]);
  const [slideNumber, setSlideNumber] = useState(0);
  const [slides, setSlides] = useState([]);
  const [openSlider, setOpenSlider] = useState(false);
  const [openHotelRooms, setOpenHotelRooms] = useState(false);
  const [hotelInfo, setHotelInfo] = useState();
  const [roomInfo, setRoomInfo] = useState();
  const [roomStyleToDisplay, setRoomStyleToDisplay] = useState();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [newlySelectedRooms, setNewlySelectedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hotel_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuthContext();
  const axiosWithInterceptors = useAxiosInterceptors();

  console.log("selectedRooms: ", selectedRooms);
  // console.log(roomOptions)

  useEffect(() => {
    let isMounted = true;
    const hotelData = async () => {
      try {
        setLoading(true);
        const res = await axiosWithInterceptors.get(`https://meridianhosts.onrender.com/api/v1/hotels/${hotel_id}`);
        // console.log('res.data.data: ', res.data.data)
        setHotelInfo({ ...res.data.data });

        const res2 = await axiosWithInterceptors.get(
          `https://meridianhosts.onrender.com/api/v1/hotels/room/${hotel_id}`
        );

        setRoomInfo([...res2.data.data]);
        const roomStyleArr = res2.data.data

          let arr = []
          roomStyleArr.forEach(roomStyle => {
            let Obj = {}
            Obj.length = roomStyle.photos.length
            if (roomStyle.photos.length) {
              Obj.slideNumber = 0
            }
            arr.push(Obj)
            
          })

          setSlides([...arr])

        isMounted && setLoading(false);
      } catch (err) {
        if (err.response.data.message) {
          navigate('/handleerror', {state: {message: err.response.data.message, path: location.pathname}})
        } else {
          navigate('/somethingwentwrong')
        }
      }
    };

    hotelData();

    return () => {
      isMounted = false;
    };
  }, [hotel_id, axiosWithInterceptors]);


  const handleSlider = (ind) => {
    setOpenSlider(true);
    setSlideNumber(ind);
  };

  const changeSlide = (direction, index) => {
    const newArr = slides.map((slide, ind) => {
      if (ind === index) {
        if (direction === "right") {
          if (slide.slideNumber === slide.length - 1) {
            return {...slide, slideNumber: 0}
          } else {
            return {...slide, slideNumber: slide.slideNumber + 1}
          }
        } else {
          if (slide.slideNumber === 0) {
            return {...slide, slideNumber: slide.length - 1}
          } else {
            return {...slide, slideNumber: slide.slideNumber - 1}
          }
        }
      } else {
        return slide
      }
    })

    setSlides([...newArr])

  };


  const selectRoomStyle = (roomStyle) => {
    setRoomStyleToDisplay({ ...roomStyle });
    if (auth.accessToken) {
      setOpenHotelRooms(true);
    } else {
      navigate("/login");
    }
  };

  // let reservedDates;
  // console.log('reservedDates: ', reservedDates)

  const reserveRooms = async () => {
    try {
      console.log("selectedRooms:", selectedRooms);
      if (selectedRooms.length > 0) {
        setSelectedRooms((prev) => {
          newlySelectedRooms.forEach((data) => {
            if (!prev.includes(data)) {
              prev.push(data);
            }
          });

          return [...prev];
        });
      } else {
        setSelectedRooms([...newlySelectedRooms]);
      }

      // send data to process payment
      const resp = await axiosWithInterceptors.post(
        "https://meridianhosts.onrender.com/api/v1/stripe/create-checkout-session",
        { selectedRooms, reservedDates: ref2.current, hotel_id }
      );
    
      window.location.href = resp.data.url;

    } catch (err) {
      if (err.response.data.message) {
        navigate('/handleerror', {state: {message: err.response.data.message, path: location.pathname}})
      } else {
        navigate('/somethingwentwrong')
      }
    }
  };

  const cancelSelections = () => {
    setSelectedRooms([]);
    setNewlySelectedRooms([]);
  };

  return (
    <div className="hotelMainContainer">
      <>
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
            <div className="hotelRoomContainer">
              <div className="hotelRoomWrapper">
                <div className="hotelInfo">
                  <div className="hotelInfoForRooms">
                    <h3 className="Hotel_Hotel_Name">{hotelInfo.name}</h3>
                    <p className="Hotel_Hotel_Address">{hotelInfo.hotelLocation.address}</p>
                    {hotelInfo.distanceToClosestTouristLocation &&
                      hotelInfo.closestTouristLocation && (
                        <h4>
                          Excellent location -{" "}
                          {hotelInfo.distanceToClosestTouristLocation} miles
                          from {hotelInfo.closestTouristLocation}
                        </h4>
                      )}
                    <h5>
                      Book a stay for as low as ${hotelInfo.cheapestPrice} per
                      night
                    </h5>
                  </div>
                  <button
                    onClick={reserveRooms}
                    disabled={
                      selectedRooms.length === 0 &&
                      newlySelectedRooms.length === 0
                    }
                    style={{ marginLeft: "5px" }}
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => cancelSelections()}
                    disabled={selectedRooms.length === 0}
                    style={{ marginLeft: "5px" }}
                  >
                    Cancel selections
                  </button>
                </div>

                {roomInfo?.map((roomStyle, index) => (
                  <>
                    <div
                      key={index}
                      className="hotelRoomDetailsContainer"
                    >
                      <div className="hotelRoomPicturesWrap">
                        <img                        
                          src={roomStyle.photos[slides[index].slideNumber]}
                          alt=""
                          width="200"
                          height="220"
                        />
                        {roomStyle.photos.length && (
                          <>
                            <FontAwesomeIcon
                              icon={faArrowLeft}
                              className="arrow"
                              onClick={() =>
                                changeSlide("left", index)
                              }
                            />
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="arrow"
                              onClick={() =>
                                changeSlide("right", index)
                              }
                            />
                          </>
                        )}
                      </div>
                      <div>
                        <div>
                          <h3 className="Hotel_RoomStyle">{roomStyle.title}</h3>
                          <p>Max occupancy: {roomStyle.maxPeople}</p>
                          <p>Non-smoking</p>
                          <p>Pillow top mattress</p>
                          <p>56 in. Television </p>
                        </div>
                        <div>
                          <p>High speed internet access</p>
                          <p>Refrigerator and microwave</p>
                          <p>Complementary breakfast</p>
                          <button onClick={() => selectRoomStyle(roomStyle)}>
                            Select
                          </button>
                          <span>$ {roomStyle.price}</span>
                        </div>
                      </div>
                    </div>
                    {/* <hr /> */}
                  </>
                ))}

               
                <div className="hotelDecs">
                  <div className="hotelDecs1">
                    <h3>{hotelInfo.description}</h3>
                    <p>{hotelInfo.detailedDescription}</p>
                  </div>
                  <div className="hotelDecs2">
                    <h4>Will exceed your expectations</h4>
                    <button
                      onClick={reserveRooms}
                      disabled={
                        selectedRooms.length === 0 &&
                        newlySelectedRooms.length === 0
                      }
                      style={{ marginLeft: "5px" }}
                    >
                      Book now
                    </button>
                    <button
                      onClick={() => cancelSelections()}
                      disabled={selectedRooms.length === 0}
                      style={{ marginLeft: "5px" }}
                    >
                      Cancel selections
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {openHotelRooms && (
              <ReserveRoom
                setOpenHotelRooms={setOpenHotelRooms}
                roomStyleToDisplay={roomStyleToDisplay}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
                newlySelectedRooms={newlySelectedRooms}
                setNewlySelectedRooms={setNewlySelectedRooms}
                ref2={ref2}
              />
            )}
            <Subscription />

          </>
        )}
      </>
    </div>
  );
};

export default Hotel;
