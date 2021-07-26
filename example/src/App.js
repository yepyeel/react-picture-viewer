import React, { useState } from 'react'

import PictureViewer from 'react-picture-viewer'
import 'react-picture-viewer/dist/index.css'
// import img1 from './assets/1.jpg'
import img1 from './assets/1.jpeg'
import img2 from './assets/2.jpg'
// import img3 from './assets/3.jpg'
import './index.css';

const App = () => {
  const [i, setI] = useState(img1);

  return (
    <div className="container">
      <button onClick={() => setI(img2)}>11123123</button>
      <div className="image">
        <PictureViewer
          className="img"
          zoomDelta={100}
          zoomMax={5000}
          picture={{ alt: 'img1', src: i }}
        />
      </div>
    </div>
  )
}

export default App
