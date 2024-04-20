import "./updateMyDetails.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";
import { RotatingLines } from "react-loader-spinner";

const username_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]{5,20}$/;

const UpdateMyDetails = () => {
  const runOnce = useRef(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState();
  const [usernameFocus, setUsernameFocus] = useState();
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const loadUser = async () => {
        try {
          setLoading(true);
          const resp = await axiosWithInterceptors.get("https://meridianhosts.onrender.com/api/v1/users/myaccount", {
            withCredentials: true,
          });
          setUserInfo({ ...resp.data.data });

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

      loadUser();
    }

    return () => {
      runOnce.current = true;
    };
  }, []);

  useEffect(() => {
    setValidUsername(username_REGEX.test(username));
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosWithInterceptors.patch(
        "https://meridianhosts.onrender.com/api/v1/users/updatemyaccount",
        { name, username, email }
      );

      // console.log(response.data)
      setName("");
      setUsername("");
      setEmail("");

      navigate("/login");
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

  return (
    <>
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
          <div className="register">
            <form className="registerContainer" onSubmit={handleSubmit}>
              <h1 className="registerTitle">Update my details</h1>
              {/* <br /> */}
              <span>name: </span>
              <span className="MyAccount_Name">{userInfo.name}</span>
              <br />
              <span>username: </span>
              <span>{userInfo.username}</span>
              <br />
              <span>email: </span>
              <span>{userInfo.email}</span>
              <br />
              <div className="registerDiv">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="registerDiv">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                />
                <p
                  className={
                    usernameFocus && !validUsername
                      ? "showInstructions"
                      : "hideInstructions"
                  }
                >
                  Username must begin with a letter.
                  <br />
                  Must contain 5 - 20 characters. <br />
                  The following characters are allowed: <br />
                  Letters, numbers, hyphens, underscores
                </p>
              </div>
              <div className="registerDiv">
                <label htmlFor="email">e-mail:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              {username ? (
                <button
                  onClick={handleSubmit}
                  className="signUpButton"
                  disabled={!validUsername}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="signUpButton"
                  disabled={!name && !email}
                >
                  Continue
                </button>
              )}
            </form>
          </div>
        )}
      </>
    </>
  );
};

export default UpdateMyDetails;
