// import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// import Home from "./pages/Home-page/Home";
// import Login from "./components/Login/Login";
// import Context from "./context";

// function App() {
//   const [user, setUser] = useState(null);

//   return (
//     <Context.Provider value={{ user, setUser }}>
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Context.Provider>
//   );
// }

// export default App;


import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home-page/Home";
import Login from "./components/Login/Login";
import Context from "./context";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Context.Provider>
  );
}

export default App;