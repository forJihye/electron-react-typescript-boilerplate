import React from 'react';
import { Routes, Route } from "react-router-dom";
import Intro from './pages/Intro';
import Main from './pages/Main';

const App = () => {
  return (<React.Fragment>
    <Routes>
      <Route path="/*" element={<Intro />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  </React.Fragment>
  )
}

export default App;