import "./subscription.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../context/authContext";

const Subscription = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (email == 'Thank you for subscribing') {
        setEmail('')
        return
      }
    e.preventDefault();
    try {
        await axios.post('https://meridianhosts.onrender.com/api/v1/users/subscriptions', {email})
        setEmail('Thank you for subscribing')
    } catch (err) {
        navigate('/register')
    }
  };


  return (
    <div className="subsContainer">
      <h3 className="subsTitle">Save time, save money</h3>
      <p className="subsDecs">Sign up and subscribe and we will send the best deals to you</p>
      <form className="subsDiv1">
        <input
          className="subsInput"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="subsButton" onClick={handleSubmit} disabled={!email}>
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Subscription;
