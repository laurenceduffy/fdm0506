import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import AnonymousRoute from './AnonymousRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import MasterPage from './pages/masterPage';

import HomePage from './pages/homePage';
import LoginPage from './pages/auth/loginPage';
import LoginHelpPage from './pages/auth/loginHelpPage';
import RegisterPage from './pages/auth/registerPage';
import LogoutPage from './pages/auth/logoutPage';
import ActivatePage from './pages/auth/activatePage';
import PleaseActivatePage from './pages/auth/pleaseActivatePage';
import ActivateSuccessPage from './pages/auth/activateSuccessPage';
import ActivateFailPage from './pages/auth/activateFailPage';
import AccountPage from './pages/accountPage';
import HistoryPage from './pages/historyPage';
import AccountsPage from './pages/accountsPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
            <Route exact path="/">
              <MasterPage page={HomePage} />
            </Route>

            <AdminRoute path="/accounts">
              <MasterPage page={AccountsPage} />
            </AdminRoute>

            <ProtectedRoute path="/account">
              <MasterPage page={AccountPage} />
            </ProtectedRoute>
            <ProtectedRoute path="/history">
              <MasterPage page={HistoryPage} />
            </ProtectedRoute>

            <Route path="/activate/:email/:code">
              <MasterPage page={ActivatePage} />
            </Route>
            <AnonymousRoute path="/please-activate">
              <MasterPage page={PleaseActivatePage} />
            </AnonymousRoute>
            <ProtectedRoute path="/activation-success">
              <MasterPage page={ActivateSuccessPage} />
            </ProtectedRoute>
            <ProtectedRoute path="/activation-fail">
              <MasterPage page={ActivateFailPage} />
            </ProtectedRoute>

            <AnonymousRoute path="/login">
              <MasterPage page={LoginPage} />
            </AnonymousRoute>
            <AnonymousRoute path="/login-help">
              <MasterPage page={LoginHelpPage} />
            </AnonymousRoute>
            <AnonymousRoute path="/register">
              <MasterPage page={RegisterPage} />
            </AnonymousRoute>
            <ProtectedRoute path="/logout">
              <MasterPage page={LogoutPage} />
            </ProtectedRoute>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
