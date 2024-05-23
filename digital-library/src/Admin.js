import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "",
  });
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
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
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/books", book);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
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
    <div>
      <div className="books-container">
        <div className="books">
          {books.map((book) => (
            <div className="book-container" key={book.id}>
              <div className="book">
                {book.cover && <img src={book.cover} alt="" />}
                <h2>{book.title}</h2>
                <button className="update_button">
                  <Link to={`/update/${book.id}`}>Update Book</Link>
                </button>
                <button
                  className="change_button"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete Book
                </button>
              </div>
            </div>
          ))}

          <div className="form-container">
            <div className="form-item">
              <h1 className="form-title">Add New Book</h1>{" "}
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
                type="text"
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
            </div>{" "}
            <div className="form-item">
              <button
                className="form-button change_button "
                onClick={handleClick}
              >
                Add
              </button>
              {error && "Something went wrong!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Admin;
