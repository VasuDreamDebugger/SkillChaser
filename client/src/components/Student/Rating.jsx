import React, { useEffect, useState } from "react";

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const ratingArray = [1, 2, 3, 4, 5];
  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) setRating(initialRating);
  }, [initialRating]);
  return (
    <div>
      {ratingArray.map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl cursor-pointer transform transition-colors ${
              starValue <= rating ? "text-red-500" : "text-gray-500"
            }`}
            onClick={() => handleRating(starValue)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
