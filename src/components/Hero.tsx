import React from 'react';
import './Hero.css';

export const Hero: React.FC = () => {
  return (
    <section className="app-hero">
      <h1 className="hero-title">Shorten your links. Expand your reach.</h1>
      <p className="hero-subtitle">
        Create short, trackable links in seconds. Professional URL management designed for modern teams.
      </p>
    </section>
  );
};
