import React from 'react';
import Hero from '../Components/Hero';
import FeaturedDestinations from '../Components/FeaturedDestinations';
import ExclusiveOffers from '../Components/ExclusiveOffers';
import Testimonial from '../Components/Testimonial';
import NewsLetter from '../Components/NewsLetter';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
