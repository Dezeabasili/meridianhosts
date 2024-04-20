import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const UpdateUser = () => {
  const [roles, setRoles] = useState("");
  const [active, setActive] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const axiosWithInterceptors = useAxiosInterceptors();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let resp = await axiosWithInterceptors.patch(
        "https://meridianhosts.onrender.com/api/v1/users/updateuser",
        { roles, active, email }
      );

      if (resp.data.data.matchedCount === 1) {
        try {
          const resp2 = await axiosWithInterceptors.post(
            "https://meridianhosts.onrender.com/api/v1/users/finduser",
            {
              email,
            }
          );

          setRoles("");
          setActive("");
          setEmail("");
          navigate("/users/getuser", { state: resp2.data.data });
        } catch (err) {
          navigate("/handleerror", {
            state: { message: "The user is disabled", path: location.pathname },
          });
        }
      } else {
        navigate("/handleerror", {
          state: {
            message: "The email provided is not in the database",
            path: location.pathname,
          },
        });
      }
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
    <div className="register">
      <form className="registerContainer" onSubmit={handleSubmit}>
        <h1 className="registerTitle">Update user details</h1>
        <div className="registerDiv">
          <p>
            Provide user e-mail in order to update user role, disable or enable
            user
          </p>
          <br />
          <label htmlFor="email">User e-mail:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="role">User role:</label>
          <input
            id="role"
            type="text"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="registerDiv">
          <label htmlFor="active">Set user to active?:</label>
          <input
            id="active"
            type="text"
            value={active}
            onChange={(e) => setActive(e.target.value)}
            autoComplete="off"
            placeholder="Yes or No"
          />
        </div>

        <button
          className="signUpButton"
          disabled={!(email && roles) && !(email && active)}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
