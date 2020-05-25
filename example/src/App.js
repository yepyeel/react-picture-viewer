import React from 'react'

import PictureViewer from 'react-picture-viewer'
import 'react-picture-viewer/dist/index.css'
import img1 from './assets/1.jpg'
import img2 from './assets/2.jpg'
import img3 from './assets/3.jpg'
import './index.css';

const App = () => {

  return (
    <div className="container">
      <div className="image">
        <PictureViewer
          className="img"
          picture={[
            { alt: 'img2', src: img2 },
            { alt: 'img1', src: img1 },
            { alt: 'img3', src: img3 }
          ]}
        />
      </div>
    </div>
  )
}

export default App
