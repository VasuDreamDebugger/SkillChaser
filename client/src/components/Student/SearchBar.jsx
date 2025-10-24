import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const searchHandler = (event) => {
    event.preventDefault();
    if (!searchInput) {
      toast.error("Enter Course to search");
    } else {
      navigate(`/course-list/${searchInput}`);
    }
  };
  return (
    <form
      onSubmit={searchHandler}
      className="max-w-xl w-full md:h-14 h-12 p-0 flex items-center bg-white  border border-gray-500/20 rounded"
    >
      <img
        src={assets.search_icon}
        alt="Search"
        className="md:w-auto w-10 px-3"
      />
      <input
        type="text"
        placeholder="Search for Courses.."
        className="w-full h-full outline-none text-gray-500/80"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 rounded text-white md:px-10 px-7 md:py-2 py-1 mx-1 cursor-pointer hover:bg-gray-200 hover:text-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
