import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const Testimonials = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      <h1 className="text-3xl font-medium text-gray-800">Testimonials</h1>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of
        transformation,success and how our platforms has made a difference in
        their lives.
      </p>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-8 mt-12 text-center px-20">
        {dummyTestimonial.map((Testimonials, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg
          
           bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img
                src={Testimonials.image}
                alt="Testimonials"
                className="h-12 w-12 rounded-full"
              />
              <h1 className="text-lg font-medium text-gray-800">
                {Testimonials.name}
              </h1>
              <p className="text-gray-800/80">{Testimonials.role}</p>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    className="h-5"
                    src={
                      index < Math.floor(Testimonials.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{Testimonials.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
