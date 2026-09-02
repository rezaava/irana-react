// withRouter.js
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let params = useParams();
    let location = useLocation();
    let navigate = useNavigate();
    
    return (
      <Component
        {...props}
        params={params}
        location={location}
        navigate={navigate}
      />
    );
  }
  
  return ComponentWithRouterProp;
}

export default withRouter;