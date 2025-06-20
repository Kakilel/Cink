import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function InstagramCallback() {
    const navigate = useNavigate();

    useEffect(() =>{
        const code = new URLSearchParams(window.location.search).get('code');

        if (code){
            fetch(`/api/instagram?code=${code}`)
            .then((res) => res.redirected ? window.location.href = res.url : res.json())
            .catch((error) => console.error('Callback error',error));
        }
    },[]);
  return (
    <>
    <p>Connecting your Instagram account...</p>
    </>
  )
}

export default InstagramCallback