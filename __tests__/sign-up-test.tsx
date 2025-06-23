import SignUp from '@/app/auth/sign-up';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

//Mock the useRouter Hook function
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('Sign-up Successful', () => {
    test('Sign up successfully then router push to complete-profile', async () => {
        const pushMock = jest.fn();

        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock
        })

        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test@email.com');
        fireEvent.changeText(password, 'Test!234');
        fireEvent.changeText(confirmPassword, 'Test!234');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith({
                pathname: '/auth/complete-profile',
                params: {
                    email: 'test@email.com',
                    fullName: 'Test User',
                    password: 'Test!234',
                },
            });
        });
    });
});

describe('Sign-up Failed', () => {
    test('Sign up failed, confirm password not matching', async () => {
        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test@email.com');
        fireEvent.changeText(password, 'Test!234');
        fireEvent.changeText(confirmPassword, 'Test!1234');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('confirmPassword must be one of the following values: Ref(password), Passwords must match')).toBeTruthy();
        });
    });

    test('Sign up failed, email not right format', async () => {
        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test');
        fireEvent.changeText(password, 'Test!234');
        fireEvent.changeText(confirmPassword, 'Test!234');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeTruthy();
        });
    });

    test('Sign up failed, password is blank', async () => {
        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test@email.com');
        fireEvent.changeText(password, '');
        fireEvent.changeText(confirmPassword, '');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeTruthy();
        });
    });

    test('Sign up failed, password is not 8 characters or more', async () => {
        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test@email.com');
        fireEvent.changeText(password, 'Test!23');
        fireEvent.changeText(confirmPassword, 'Test!23');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
        });
    });

    test('Sign up failed, password does not match format', async () => {
        render(<SignUp/>);

        const fullName = screen.getByTestId('fullName');
        const email = screen.getByPlaceholderText('Enter your email address');
        const password = screen.getByPlaceholderText('Enter your password');
        const confirmPassword = screen.getByPlaceholderText('Enter your password again');

        const submitButton = screen.getAllByText('Create Account')[1];

        fireEvent.changeText(fullName, 'Test User');
        fireEvent.changeText(email, 'test@email.com');
        fireEvent.changeText(password, 'test!234');
        fireEvent.changeText(confirmPassword, 'test!234');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeTruthy();
        });
    });
});