# BeCommunity-Frontend

This is the repositary for the frontend code of becommunity website. It will contain all the code of frontend components and pages of the website.
## Installation

```bash
1. git clone https://github.com/ishan249/becommunity-frontend.git
2. cd becommunity-frontend
3. npm install 
4. npm run dev
```

## BeCommunity-Backend Repo Link: 
https://github.com/GitSam67/BeCommunity-Backend

## Folder Structure
### src
Source folder will contain all the major directory such as components, pages and files such as App.jsx, index.css with the  assests needed for the website.
### Components
Components folder will contain all the building blocks of the particular component which can be reused in different pages.

### Pages
Pages folder will contain code of all main Pages of the website which can be also called as routes. (e.g path="/" URL will be mapped to Welcomepage.jsx component)


## App.jsx (routing)
App.jsx file will contain code for all the routing and URL mapping of react app
```javascript
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcomepage from "./pages/WelcomePage/Welcomepage";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route exact path ="/" element={<Welcomepage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;

```

## License

[MIT](https://github.com/ishan249/becommunity-frontend/blob/master/LICENSE)
