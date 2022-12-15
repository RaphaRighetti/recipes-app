// import React from 'react';
// import { createMemoryHistory } from 'history';
// import { Router } from 'react-router-dom';
// import { render } from '@testing-library/react';

// function withRouter(component, history) {
//   return (
//     <Router history={ history }>
//       { component }
//     </Router>
//   );
// }

// export default function renderWithRouter(
//   component,
//   {
//     initialEntries = ['/'],
//     history = createMemoryHistory({ initialEntries }),
//   } = {},
// ) {
//   return {
//     ...render(withRouter(component, history)),
//     history,
//   };
// }

import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};
export default renderWithRouter;
