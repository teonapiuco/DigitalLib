import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Update = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
  });
  const [error, setError] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);
  const bookId = location.pathname.split("/")[2];
  const foundBook = books.find((book) => book.id === parseInt(bookId));
  const bookTitle = foundBook
    ? foundBook.title
    : "The book has not been found.";
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8800/books/${bookId}`, book);
      navigate("/admin");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };
  useEffect(() => {
    GetUserAccess();
  }, []);
  const GetUserAccess = () => {
    const userrole =
      sessionStorage.getItem("userrole") != null
        ? sessionStorage.getItem("userrole").toString()
        : "";
    console.log(userrole);
    fetch(
      "http://localhost:8000/roleaccess?role=" + userrole + "&menu=admin"
    ).then((res) => {
      console.log(res);
      if (!res.ok) {
        navigate("/login");
        toast.warning("You are not authorized to access");
        return false;
      }
      return res.json();
    });
  };
  return (
    <div className="form-container">
      <div className="form-item">
        <h1 className="form-title">Update {bookTitle}</h1>
      </div>
      <div className="form-item">
        <input
          className="form-input"
          type="text"
          placeholder="Book title"
          name="title"
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <textarea
          className="form-textarea"
          rows={5}
          placeholder="Book desc"
          name="desc"
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <input
          className="form-input"
          type="text"
          placeholder="Book cover"
          name="cover"
          onChange={handleChange}
        />
      </div>
      <div className="form-item">
        <button className="form-button change_button " onClick={handleClick}>
          Update Book
        </button>
      </div>
      {error && <div className="error-message">Something went wrong!</div>}
    </div>
  );
};
export default Update;
