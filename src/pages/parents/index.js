import AdminLayout from '../admin/adminLayout'
import AddParent from '../../app/components/parents/AddParent';
import ParentList from '../../app/components/parents/ParentList';
import withAuth from '../../../utils/withAuth';

export default withAuth(function Parents() {
  return (
    <AdminLayout>
      <div className="flex gap-4">
        <div className="w-1/3">
          <AddParent />
        </div>
        <div className="w-2/3">
          <ParentList />
        </div>
      </div>
    </AdminLayout>
  );
});
