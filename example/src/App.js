import React from 'react'

import PictureViewer from 'react-picture-viewer'
import 'react-picture-viewer/dist/index.css'
import img1 from './assets/1.jpg';
import './index.css';

const App = () => {
  return (
    <div className="container">
      <div className="image">
        {/* <PictureViewer picture={{ src: img1, alt: 'img1' }} /> */}
        <PictureViewer
          className="img"
          picture={{
            alt: 'img1',
            // src: 'https://jonham.oss-cn-shanghai.aliyuncs.com/shxg-admin/imgs/prj-img/K.jpg'
            src: img1
          }}
        />
      </div>
    </div>
  )
}

export default App
