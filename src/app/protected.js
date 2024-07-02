// pages/protected.js
import withAuth from '../utils/withAuth';

const ProtectedPage = () => {
  return (
    <div>
      <h1>This is a protected page</h1>
    </div>
  );
};

export default withAuth(ProtectedPage);
