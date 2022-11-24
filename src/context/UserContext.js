import React from "react";
import { API_BASE_URL } from "./config"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    case "CUSTOMERLISTING":
      return { ...state, listing: action.payload };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (

    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>

  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut, customersList, addCustomer, deleteCustomer, updateCustomer };


//##########################################################
function customersList(dispatch, setIsLoading, limit, page, sortby, descending) {
  setIsLoading(true);

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }

  axios.get(`${API_BASE_URL}/customers/paginate?rowsPerPage=${limit}&page=${page}&sortBy=${sortby}&descending=${descending}`, config).then(response => { return response; }).then(responses => {

    if (responses && responses.status === 200) {
      setTimeout(() => {
        // setError(null)
        setIsLoading(false)
        dispatch({ type: 'CUSTOMERLISTING', payload: responses && responses.data && responses.data.data })

      }, 2000);

    }

  }).catch(err => {
    dispatch({ type: 'CUSTOMERLISTING', payload: [] })
    console.log(err);

  });

}



// ###########################################################

function updateCustomer(dispatch, id, name, address, email, mobile, gender, history, setIsLoading, setError, limit, page, sortby, descending, setErrors) {
  setError(false);
  setIsLoading(true);

  const errors = {};

  if (name === "") {

    errors.name = 'Please enter name.';

  }
  if (address === "") {

    errors.address = 'Please add address.';

  }


  if (email === "") {

    errors.email = 'Please enter email address.';

  }
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {


  } else {
    errors.email = 'Please enter valid email address.';
  }
  if (mobile === "") {

    errors.mobile = 'Please enter mobile no.';

  }
  if (gender === "Select Gender") {

    errors.gender = 'Please choose gender.';

  }
  if (errors.name || errors.address || errors.email || errors.mobile || errors.gender) {
    setErrors(errors);
    setIsLoading(false);
    return
  } else {
    setErrors({ errors: {} });
  }

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }


  const formData = new FormData();
  formData.append('name', name);
  formData.append('address', address);
  formData.append('email', email);
  formData.append('mobile_no', mobile);
  formData.append('gender', gender);



  axios.patch(`${API_BASE_URL}/customers/${id}`, formData, config).then(response => { return response; }).then(responses => {

    //console.log("resresresresres", responses && responses.data, responses);
    //history.push(`/code-of-conduct/${slug}`);
    customersList(dispatch, setIsLoading, limit, page, sortby, descending)
    if (responses && responses.status === 200) {

      setTimeout(() => {
        //localStorage.setItem('id_token', responses && responses.data && responses.data.token)
        setError(null)
        setIsLoading(false)
        history.push('/app/dashboard')
      }, 2000);

    } else {

      setError(true);
      setIsLoading(false);
    }



  }).catch(err => {

    console.log(err);

  });



}


// ###########################################################

function addCustomer(dispatch, name, address, email, mobile, gender, history, setIsLoading, setError, limit, page, sortby, descending, setErrors) {
  setError(false);
  setIsLoading(true);

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }

  const errors = {};

  if (name === "") {

    errors.name = 'Please enter name.';

  }
  if (address === "") {

    errors.address = 'Please add address.';

  }


  if (email === "") {

    errors.email = 'Please enter email address.';

  }
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {


  } else {
    errors.email = 'Please enter valid email address.';
  }
  if (mobile === "") {

    errors.mobile = 'Please enter mobile no.';

  }
  if (gender === "Select Gender") {

    errors.gender = 'Please choose gender.';

  }
  if (errors.name || errors.address || errors.email || errors.mobile || errors.gender) {
    setErrors(errors);
    setIsLoading(false);
    return
  } else {
    setErrors({ errors: {} });
  }
  const formData = new FormData();
  formData.append('name', name);
  formData.append('address', address);
  formData.append('email', email);
  formData.append('mobile_no', mobile);
  formData.append('gender', gender);



  axios.post(API_BASE_URL + "/customers", formData, config).then(response => { return response; }).then(responses => {

    //console.log("resresresresres", responses && responses.data, responses);
    //history.push(`/code-of-conduct/${slug}`);
    customersList(dispatch, setIsLoading, limit, page, sortby, descending)
    if (responses && responses.status === 200) {

      setTimeout(() => {
        //localStorage.setItem('id_token', responses && responses.data && responses.data.token)
        setError(null)
        setIsLoading(false)

        history.push('/app/dashboard')
      }, 2000);


    } else {

      setError(true);
      setIsLoading(false);
    }



  }).catch(err => {

    console.log(err);

  });



}

// ###########################################################

function deleteCustomer(dispatch, id, history, setIsLoading, setError, limit, page, sortby, descending) {
  setError(false);
  setIsLoading(true);

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }



  axios.delete(`${API_BASE_URL}/customers/${id}`, config).then(response => { return response; }).then(responses => {

    //console.log("resresresresres", responses && responses.data, responses);
    //history.push(`/code-of-conduct/${slug}`);
    customersList(dispatch, setIsLoading, limit, page, sortby, descending)
    if (responses && responses.status === 200) {

      setTimeout(() => {
        //localStorage.setItem('id_token', responses && responses.data && responses.data.token)
        setError(null)
        setIsLoading(false)
        history.push('/app/dashboard')
      }, 2000);

    } else {

      setError(true);
      setIsLoading(false);
    }



  }).catch(err => {

    console.log(err);

  });



}

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  const formDataLogin = new FormData();
  formDataLogin.append('password', password);
  formDataLogin.append('email', login);


  axios.post(API_BASE_URL + "/auth/login", formDataLogin).then(response => { return response; }).then(responses => {

    // console.log("resresresresresdddd", responses && responses.data);
    //history.push(`/code-of-conduct/${slug}`);

    if (responses && responses.status === 200) {
      setTimeout(() => {
        localStorage.setItem('id_token', responses && responses.data && responses.data.token)
        localStorage.setItem('name', responses && responses.data && responses.data.user && responses.data.user.name)
        setError(null)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS' })

        history.push('/app/dashboard')
      }, 2000);

    } else {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    }



  }).catch(err => {
    if (err && err.response && err.response.status === 401) {
      setError(err && err.response && err.response.data && err.response.data.messages[0])
      setIsLoading(false)

    }


  });

}

function signOut(dispatch, history) {
  var accessToken = localStorage.getItem("id_token");




  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
  };
  fetch(API_BASE_URL + "/auth/logout", requestOptions)
    .then(response => response.json())
    .then(data => {
      //console.log("data", data)
      localStorage.removeItem("id_token");
      dispatch({ type: "SIGN_OUT_SUCCESS" });
      history.push("/login");

    });


}
