import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import ToDo from './pages/ToDo'
import AuthCheck from './router/AuthCheck'

function App() {

  return (
    <div>
      <Router>
          <Routes>
            <Route path='/' element={ <SignIn/> }/> 
            <Route path='/todo' element={ <AuthCheck><ToDo/></AuthCheck> }/> 
          </Routes>
      </Router>
    </div>
  )
}

export default App
