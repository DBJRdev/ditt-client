import ReactDOM from 'react-dom';
import loadMaterialDesignIcons from './components/Icon/load-material-design-icons';
import app from './app';
import history from './routerHistory';
import store from './store';
// Initialize translator
import './translator';

// React UI core CSS
import '@react-ui-org/react-ui/src/lib/theme.scss';
import '@react-ui-org/react-ui/src/lib/foundation.scss';
import '@react-ui-org/react-ui/src/lib/helpers.scss';

// App and theme CSS
import './styles/main.scss';

// Load Material Design icons
loadMaterialDesignIcons();

ReactDOM.render(
  app(store, history),
  document.getElementById('app'),
);
