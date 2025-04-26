'use strict';

const React = require('react');

// Mock Link component for tests
function Link({ href, children, replace, ...props }) {
  // Handle the replace prop separately to avoid React warnings
  const handleClick = (e) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return React.createElement('a', { href, onClick: handleClick, ...props }, children);
}

module.exports = Link;
