// __mocks__/svgrMock.js
import React from 'react';

// This creates a simple SVG mock that Jest can use in place of your actual SVG files
export default function SvgrMock(props) {
  return <svg {...props} />;
}
