import {createContext,useReducer,useEffect}from 'react'
import {auth} from '../firebase'
import { onAuthStateChanged } from 'firebase/auth';

export const DashboardContext = createContext();

const initialState = {
  user:null,
  socialAccounts: [],
  analytics: {}
};

const reducer = (state,action) => {
  switch(action.type){
    case 'SET_USER' : return {...state, user:action.payload}
    case 'SET_SOCIAL_ACCOUNTS' :return {...state,socialAccounts:action.payload}
    case 'SET_ANALYTICS' : return {...state,analytics:action.payload}
    default:return state;
  }
};

 const DashboardProvider = ({children}) => {
  const [state,dispatch] = useReducer(reducer,initialState);

  useEffect (() =>{
    const unsub = onAuthStateChanged(auth,user => {
      dispatch({type:'SET_USER',payload:user})
    });
    return() =>unsub();
  },[]);

  return (
    <>
    <DashboardContext.Provider value ={{...state,dispatch}}>
      {children}
    </DashboardContext.Provider>
    
    </>
  )
}

export default DashboardProvider


