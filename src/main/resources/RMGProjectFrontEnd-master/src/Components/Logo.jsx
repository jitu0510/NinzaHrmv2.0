// Logo.js

import React from 'react';

const Logo = ({ src, alt }) => {
  return (
    <div className="logo-container">
      <img height="40" width="100" src={src} alt={alt} className="logo-image" />
    </div>
  );
};

export default Logo;
