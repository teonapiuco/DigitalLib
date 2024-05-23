import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [bookStates, setBookStates] = useState({});
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const storeBookStates = () => {
    localStorage.setItem("bookStates", JSON.stringify(bookStates));
  };

  const getBookStatesFromLocalStorage = () => {
    const storedStates = localStorage.getItem("bookStates");
    return storedStates ? JSON.parse(storedStates) : {};
  };

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

  useEffect(() => {
    GetUserAccess();
  }, []);

  useEffect(() => {
    const userRequestedBooks =
      JSON.parse(sessionStorage.getItem("requestedBooks")) || [];
    setRequestedBooks(userRequestedBooks);
  }, []);

  const GetUserAccess = () => {
    const userrole = sessionStorage.getItem("userrole") || "";
    fetch("http://localhost:8000/roleaccess?role=" + userrole + "&menu=user")
      .then((res) => {
        if (!res.ok) {
          navigate("/login");
          toast.warning("You are not authorized to access");
          return false;
        }
        return res.json();
      })
      .then((data) => {
        const requestedBooks = data.books || [];
        setRequestedBooks(requestedBooks);
        sessionStorage.setItem(
          "requestedBooks",
          JSON.stringify(requestedBooks)
        );
        const username = sessionStorage.getItem("username");
        setUsername(username);
        setBookStates(getBookStatesFromLocalStorage());
      });
  };

  const handleButtonClick = async (bookId, bookTitle) => {
    try {
      const response = await axios.post(
        "https://ofm34cji9l.execute-api.us-east-1.amazonaws.com/Lambda"
      );
      const newState = {
        ...bookStates,
        [bookId]: {
          requestedBy: username,
          requested: true,
          title: bookTitle,
        },
      };
      localStorage.setItem("bookStates", JSON.stringify(newState));
      setBookStates(newState);

      toast.success(response.data);
    } catch (error) {
      console.error("Error calling Lambda:", error);
      toast.error("Error borrowing book. Please try again later.");
    }
  };

  const displayElement = (bookId, bookTitle) => {
    const storedStates = getBookStatesFromLocalStorage();
    const bookState = storedStates[bookId];
    if (bookState && bookState.requested) {
      return (
        <div style={{ color: "#CCE5FF", marginTop: "20px" }}>
          The book <span>{bookTitle}</span> has been borrowed by{" "}
          <span>{bookState.requestedBy}</span>
        </div>
      );
    } else {
      return (
        <button
          className="change_button"
          onClick={() => handleButtonClick(bookId, bookTitle)}
        >
          Borrow this book
        </button>
      );
    }
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
                <p>{book.desc}</p>
                {displayElement(book.id, book.title)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
