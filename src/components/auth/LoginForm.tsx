import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Form handling implementation
};

export default LoginForm; 