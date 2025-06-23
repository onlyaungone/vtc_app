import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Auth } from 'aws-amplify';
import Verification from '@/app/auth/verification';
import { Formik } from 'formik';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

jest.mock('aws-amplify', () => ({
Auth: {
    confirmSignUp: jest.fn(),
    signOut: jest.fn(),
},
}));

describe('Verification', () => {
    const mockRouter = { push: jest.fn() };
    const email = 'test@example.com';

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useLocalSearchParams as jest.Mock).mockReturnValue({ email });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('submits verification code successfully', async () => {
        render(<Verification />);

        (Auth.confirmSignUp as jest.Mock).mockResolvedValueOnce({});

        fireEvent.changeText(screen.getByPlaceholderText('Enter your confirmation code'), '123456');
        fireEvent.press(screen.getByText('Continue'));

        await waitFor(() => {
        expect(Auth.confirmSignUp).toHaveBeenCalledWith(email, '123456');
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/signup-successful');
        });
    });
});
