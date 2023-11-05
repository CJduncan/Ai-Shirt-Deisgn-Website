import React from 'react';
import Canvas from './Canvas/index';
import Home from "./pages/Home";
import Custom from './pages/Custom';


function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Custom />
    </main>
  );
}

export default App;

