'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api/clientApi'; 
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInPage.module.css';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Enter a valid email address'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return null;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.errors[0];
      }
      return 'Validation failed';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const validationError = await validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const user = await loginUser(formData); 
      if (user) {
        setUser(user); 
        router.push('/profile');
      } else {
        setError('Invalid login data');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Try again.');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
