import { useState, useCallback, useEffect } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import './SearchBox.css'

function App() {
  const INITIAL_CAMERA = {
    center: {lat: 40.7, lng: -74},
    zoom: 12
  };

  const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA)
  const [schoolName, setSchoolName] = useState('')
  const [results, setResults] = useState(null)

  const handleCameraChange = useCallback((event) =>
    setCameraProps(event.detail)
  );

  const handleSchoolNameChange = (event) => {
    setSchoolName(event.target.value)
  }

  const handleResultClick = (event, result) => {
    event.preventDefault()
    setCameraProps({
      center: {lat: result.latitude, lng: result.longitude},
      zoom: 17
    })
    setResults(null)
  }

  const fetchResults = async () => {
    const url = `https://entera-api-d7d02bcf3d5e.herokuapp.com//college?school_name=${schoolName}`;
      try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setResults(json)
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if(schoolName.length >= 3) {
      fetchResults()
    } else {
      setResults(null)
    }
  }, [schoolName])

  return (
    <>
      <div id="search_college">
        <input id="search_box" type="text" placeholder="Search by school name" onChange={handleSchoolNameChange}/>
        {results?.length > 0 &&
          <ul>
            {results.map(result => {
              return <li key={result.id} onClick={event => handleResultClick(event, result)}>{result.name}</li>
            })}
          </ul>}
      </div>
      <APIProvider apiKey={'AIzaSyDmM3rU9xgxUdjsdJQi-KLJ9cm3mWCfWWA'} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          style={{width: '100vw', height: '90vh'}}
          {...cameraProps}
          onCameraChanged={handleCameraChange}>
        </Map>
      </APIProvider>
    </>
  )
}

export default App
