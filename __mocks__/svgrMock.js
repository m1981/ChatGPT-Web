// __mocks__/svgrMock.js
import * as React from 'react';

const SvgrMock = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
export const ReactComponent = SvgrMock;

export default 'svgr-mock';
