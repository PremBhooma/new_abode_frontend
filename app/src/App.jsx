import { BrowserRouter } from 'react-router-dom';
import Approuter from './Approuter';

function App() {
  return (
    <BrowserRouter>
      <Approuter />
    </BrowserRouter>
  );
}

export default App;

// import { HashRouter } from 'react-router-dom';
// import Approuter from './Approuter';
// import UpdateNotifier from './UpdateNotifier.jsx';

// function App() {
//   return (
//     <>
//       <HashRouter>
//         <Approuter />
//       </HashRouter>

//       <UpdateNotifier />
//     </>
//   );
// }

// export default App;