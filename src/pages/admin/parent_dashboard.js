import React from 'react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AdminLayout from './adminLayout';
import { ref, get, push, update } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { Button, Modal, TextField, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newChild, setNewChild] = useState({ studentId: '' });

  useEffect(() => {
    if (session) {
      setUserEmail(session.user.email);
      fetchUserIdFromUserTypes();
    }
  }, [session]);

  useEffect(() => {
    if (userId) {
      fetchChildren();
    }
  }, [userId]);

  const fetchUserIdFromUserTypes = async () => {
    if (!session?.user?.email) return;
    
    try {
      const userTypesRef = ref(database, 'userTypes');
      const userTypesSnapshot = await get(userTypesRef);

      if (userTypesSnapshot.exists()) {
        const allUsersData = userTypesSnapshot.val();
        const matchedUser = Object.entries(allUsersData).find(([_, user]) => 
          user.email === session.user.email
        );

        if (matchedUser) {
          const [userId, userInfo] = matchedUser;
          setUserId(userId);
          console.log('User found:', userInfo);
        } else {
          console.log('User not found in userTypes');
        }
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const fetchChildren = async () => {
    if (!userId) return;
    try {
      const myChildRef = ref(database, 'myChild');
      const myChildSnapshot = await get(myChildRef);
      
      if (myChildSnapshot.exists()) {
        const allChildren = myChildSnapshot.val();
        const userChildren = Object.entries(allChildren)
          .filter(([_, child]) => 
            child.parentId === userId 
          )
          .map(([id, child]) => ({
            id,
            ...child
          }));
        setChildren(userChildren);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentRef = ref(database, 'myChild');
      const newStudentRef = push(studentRef);
      const studentId = newStudentRef.key;

      const updates = {};
      updates[`/myChild/${studentId}`] = {
        studentId: newChild.studentId,
        parentId: userId,
        parentEmail: session.user.email,
        status: 'pending'
      };

      await update(ref(database), updates);

      setChildren(prevChildren => [...prevChildren, {
        id: studentId,
        studentId: newChild.studentId,
        parentId: userId,
        parentEmail: session.user.email,
        status: 'pending'
      }]);

      setNewChild({ studentId: '' });
      handleModalClose();
      toast.success('Child added successfully!');
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error('Failed to add child. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-4">
        <div className="mb-4">
          <p>User ID: {userId || 'Loading...'}</p>
          <p>Email: {userEmail || 'Loading...'}</p>
        </div>

        {/* Children Section */}
        <div className="mt-6 bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Children</h2>
            <Button variant="contained" onClick={handleModalOpen}>
              Add Child
            </Button>
          </div>

          <List>
            {children.map((child, index) => (
              <React.Fragment key={child.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Student ID: ${child.studentId}`}
                    secondary={`Status: ${child.status}`}
                  />
                </ListItem>
                {index < children.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </div>

        {/* Add Child Modal */}
        <Modal
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="add-child-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Add New Child
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentId"
                value={newChild.studentId}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleModalClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add Child</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
}
