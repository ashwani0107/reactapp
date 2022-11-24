import React from "react";
import { API_BASE_URL } from "./config"
import axios from 'axios'

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

    console.log(err);

  });

}



// ###########################################################

function updateCustomer(dispatch, id, name, address, email, mobile, gender, history, setIsLoading, setError, limit, page, sortby, descending) {
  setError(false);
  setIsLoading(true);

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const formDataLogin = new FormData();
  formDataLogin.append('name', name);
  formDataLogin.append('address', address);
  formDataLogin.append('email', email);
  formDataLogin.append('mobile_no', mobile);
  formDataLogin.append('gender', gender);



  axios.patch(`${API_BASE_URL}/customers/${id}`, formDataLogin, config).then(response => { return response; }).then(responses => {

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

function addCustomer(dispatch, name, address, email, mobile, gender, history, setIsLoading, setError, limit, page, sortby, descending) {
  setError(false);
  setIsLoading(true);

  var accessToken = localStorage.getItem("id_token");
  let config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const formDataLogin = new FormData();
  formDataLogin.append('name', name);
  formDataLogin.append('address', address);
  formDataLogin.append('email', email);
  formDataLogin.append('mobile_no', mobile);
  formDataLogin.append('gender', gender);



  axios.post(API_BASE_URL + "/customers", formDataLogin, config).then(response => { return response; }).then(responses => {

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

    //console.log("resresresresres", responses && responses.data, responses);
    //history.push(`/code-of-conduct/${slug}`);

    if (responses && responses.status === 200) {
      setTimeout(() => {
        localStorage.setItem('id_token', responses && responses.data && responses.data.token)
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


  // if (!!login && !!password) {
  //   setTimeout(() => {
  //     localStorage.setItem('id_token', 1)
  //     setError(null)
  //     setIsLoading(false)
  //     dispatch({ type: 'LOGIN_SUCCESS' })

  //     history.push('/app/dashboard')
  //   }, 2000);
  // } else {
  //   dispatch({ type: "LOGIN_FAILURE" });
  //   setError(true);
  //   setIsLoading(false);
  // }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
