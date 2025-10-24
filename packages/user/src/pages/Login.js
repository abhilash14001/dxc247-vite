import axios from "axios";
import axiosFetch from "@dxc247/shared/utils/Constants";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@dxc247/shared/contexts/AuthContext";
import { useLoading } from "@dxc247/shared/hooks/useLoading";
import Notify from "@dxc247/shared/utils/Notify";
import { loginSuccess } from "@dxc247/shared/store/slices/userSlice";
import { setLiveModeData, setServerPublicKey } from "@dxc247/shared/store/slices/commonDataSlice";

function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { hideLoading } = useLoading();
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const {
    getCasinoList,
    getCricketList,
    setACCESS_TOKEN,
    getBalance,
  } = useContext(AuthContext);
  
  // Get user data from Redux instead of AuthContext
  const isLoggedIn = useSelector(state => state.user.isAuthenticated);
  const { liveModeData, serverPublicKey } = useSelector((state) => state.commonData);

  // Hide loading when Login component mounts
  useEffect(() => {
    hideLoading();
  }, [hideLoading]);


  // Function to handle Login button click
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosFetch("login", "post", null, {
      username: state.username,
      password: state.password,
    })
      .then((res) => {

     
        
      
        dispatch(
          loginSuccess({
            token: res.data.token,
            user: res.data.user,
            name : res.data.name,
            balance: res.data.balance || 0,
            exposure: res.data.exposure || 0,
            casinoList: res.data.casinoList || [],
            cricketList: res.data.cricketList || [],
            ch_pas: res.data.ch_pas || 1,
            isTrPassChange: res.data.isTrPassChange || 1,
          })
        );

        updateLocalStorage(res);


        // Use setTimeout to ensure Redux state is updated before making API calls
        setTimeout(() => {
          fetchData(res.data.token);
        }, 0);

        getBalance();
        return nav("/");
      })
      .catch((error) => {
        // Check if error response status is 422
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;

          let errorMessages = [];

          for (let property in errors) {
            // errors[property] is an array of messages for this property
            errorMessages.push(errors[property].join(", "));
          }

          // Join all messages into a single string
          const errorMessageString = errorMessages.join("\n");

          // Show error using toaster
          Notify(errorMessageString, null, null, "danger");
        } else {
          // Handle other errors
          const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
          Notify(errorMessage, null, null, "danger");
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  // Function to handle Login with Demo ID button click
  const handleDemoLogin = async () => {
    try {
      const demoLoginResponse = await demoLogin();
      
      
        
      if(!serverPublicKey){
        const response = await axios.get(import.meta.env.VITE_API_URL + "/p-key-get");
        dispatch(setServerPublicKey(response.data.publicKey));
      } 
      
      dispatch(
        loginSuccess({
          token: demoLoginResponse.data.token,
          user: demoLoginResponse.data.user,
        })
      );
      updateLocalStorage(demoLoginResponse);

      // Fetch banner details after successful demo login
      

      // Dispatch loginSuccess FIRST to update Redux state with new token

      // Use setTimeout to ensure Redux state is updated before making API calls
      setTimeout(() => {
        fetchData(demoLoginResponse.data.token);
      }, 0);

      getBalance();

      return nav("/");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Demo login failed. Please try again.";
      Notify(errorMessage, null, null, "danger");
    }
  };

  const demoLogin = () => {
    return axiosFetch("demo_login", "post");
  };

  const updateLocalStorage = (response) => {
    // Token is now managed by Redux, no need to store in localStorage
    setACCESS_TOKEN(response.data.token);
  };

  const fetchData = (token) => {
    getCasinoList(token);
    getCricketList(token);
  
  };
  useEffect(() => {
    const fetchLiveModeData = async () => {
      try {


           
        if(!serverPublicKey){
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/p-key-get`);
          dispatch(setServerPublicKey(response.data.publicKey)); 
        }

        const response = await axiosFetch("admin/domain-details", "GET");
        if (response && response.data) {
          dispatch(setLiveModeData(response.data?.data || response.data));
        }
      } catch (error) {
        console.error("Error fetching live mode data:", error);
      }
    };
  
    if (!liveModeData || Object.keys(liveModeData).length === 0) {
      fetchLiveModeData();
    }
  }, [liveModeData]);


  return (
    <main>
      <div className="wrapper">
        <div className="login-page">
          <div className="login-box">
            <div className="logo-login">
              <img
                src={
                  liveModeData?.logo ||
                  `${import.meta.env.VITE_MAIN_URL}/uploads/sites_configuration/C3K6931720187871logo (1).png`
                }
                alt="Logo"
              />
            </div>
            <div className="login-form mt-4">
              <h4 className="text-center login-title">
                LOGIN <i className="fas fa-hand-point-down"></i>
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 input-group position-relative">
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    onChange={handleInputChange}
                    placeholder="Username"
                    defaultValue={state.username}
                  />
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                </div>

                <div className="mb-4 input-group position-relative">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    onChange={handleInputChange}
                    placeholder="Password"
                    defaultValue={state.password}
                  />
                  <span className="input-group-text">
                    <i className="fas fa-key"></i>
                  </span>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    id="login_submit"
                  >
                    Login<i className="fas fa-sign-in-alt float-end mt-1"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-2"
                    onClick={handleDemoLogin}
                  >
                    Login with demo ID
                    <i className="fas fa-sign-in-alt float-end mt-1"></i>
                  </button>
                  
                </div>

                <small className="recaptchaTerms mt-1">
                  This site is protected by reCAPTCHA and the Google
                  <a href="https://policies.google.com/privacy">
                    {" "}
                    Privacy Policy
                  </a>{" "}
                  and
                  <a href="https://policies.google.com/terms">
                    {" "}
                    Terms of Service
                  </a>{" "}
                  apply.
                </small>
                <p className="mt-1"></p>

                <section className="footer footer-login">
                  <div className="footer-top">
                    <div className="footer-links"></div>
                    <div className="support-detail">
                      <h2>24X7 Support</h2>
                      <p></p>
                    </div>
                    <div className="social-icons-box"></div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
