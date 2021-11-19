import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage'
import StepPage from './pages/StepPage'
import AllAssesmentPage from './pages/assesment/AllAssesmentPage'



function App() {
  return (
    <>
    <Switch>
          <Route exact path="/assesment" component={AllAssesmentPage} />
          <Route exact path="/" component={HomePage} />
          <Route path="/step/:stepNo" component={StepPage} />
          
        </Switch>
    </>
  );
}

export default App;
