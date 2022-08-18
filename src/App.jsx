import { Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Entry from './Entry';
import routes from './router'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index="/" element={<Entry />}>
          {
            routes.map(({ path, component: Component }, index) => {
              return (
                <Route key={index} path={path} element={
                  <Suspense fallback={<div>loading...</div>}>
                    <Component />
                  </Suspense>
                } />
              )
            })
          }
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;