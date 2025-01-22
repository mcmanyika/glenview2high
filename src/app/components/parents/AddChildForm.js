import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { ref, push, update } from 'firebase/database';

import { database } from '../../../../utils/firebaseConfig';

export default function AddChildForm({ open, onClose, parentId }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    className: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const studentRef = ref(database, 'students');
      const newStudentRef = push(studentRef);
      const studentId = newStudentRef.key;

      const updates = {};
      
      // Add student data
      updates[`/students/${studentId}`] = {
        ...formData,
        parents: {
          [parentId]: {
            relationshipType: 'parent',
            isPrimaryGuardian: true
          }
        }
      };

      // Add reference to parent's children
      updates[`/parents/${parentId}/children/${studentId}`] = true;

      // Execute all updates atomically
      await update(ref(database), updates);

      setFormData({
        firstName: '',
        lastName: '',
        grade: '',
        className: ''
      });
      onClose();

    } catch (error) {
      console.error('Error adding child:', error);
      setError('Failed to add child. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Child</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              required
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              select
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              fullWidth
            >
              {grades.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  Grade {grade}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              label="Class Name"
              name="className"
              value={formData.className}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., 8A"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Child'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}