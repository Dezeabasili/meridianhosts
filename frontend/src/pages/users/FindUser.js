import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const FindUser = () => {
  const [email, setEmail] = useState();

  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axiosWithInterceptors.post("https://meridianhosts.onrender.com/api/v1/users/finduser", {
        email,
      });
      // console.log(resp.data.data);
    //   userArray.push(resp.data.data);
      navigate("/users/getuser", { state: resp.data.data });
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
        <h3 className="registerTitle">Provide the user email</h3>

        <div className="registerDiv">
          <label htmlFor="email">User email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button className="signUpButton" disabled={!email}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default FindUser;
