import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Books from "./Books";
import Admin from "./Admin";
import Update from "./Update";
import { ToastContainer } from "react-toastify";
import Appheader from "./Appheader";

function App() {
  return (
    <div className="App">
      <ToastContainer theme="colored" position="top-center"></ToastContainer>
      <BrowserRouter>
        <Appheader></Appheader>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/books" element={<Books />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/update/:id" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
