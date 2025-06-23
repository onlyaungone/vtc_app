import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SignInScreen from '@/app/auth/sign-in'
import { Auth } from 'aws-amplify';
import { useRouter } from 'expo-router';

//Mock the router hook
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

//Mock AWS Amplify library
jest.mock('aws-amplify', () => ({
    Auth: {
        signIn: jest.fn(),
    },
}));

const mockRouter = {
    push: jest.fn(),
};

describe('Sign-in Sucessful', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Sign in successfully and push router to welcome screen', async () => {
        (Auth.signIn as jest.Mock).mockResolvedValueOnce({});

        render(<SignInScreen />);
        
        fireEvent.changeText(screen.getByPlaceholderText('Enter your email address'), 'test@email.com');
        fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'Test!234');
        
        fireEvent.press(screen.getAllByText('Login')[1]);

        await waitFor(() => {
            expect(Auth.signIn).toHaveBeenCalledWith('test@email.com', 'Test!234');
            expect(mockRouter.push).toHaveBeenCalledWith('/onboarding/welcome/start');
        });
    });
});

describe('Sign-in Failed', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Sign in failed, email does not exist in AWS Cognito', async () => {
        (Auth.signIn as jest.Mock).mockRejectedValueOnce({ name: 'UserNotFoundException' });

        render(<SignInScreen />);
        
        fireEvent.changeText(screen.getByPlaceholderText('Enter your email address'), 'unknown@email.com');
        fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'Test!234');
        
        fireEvent.press(screen.getAllByText('Login')[1]);

        await waitFor(() => {
            expect(screen.getByText('Email does not exist')).toBeTruthy();
        });
    });

    test('Sign in failed, incorrect password', async () => {
        (Auth.signIn as jest.Mock).mockRejectedValueOnce({ name: 'NotAuthorizedException' });

        render(<SignInScreen />);
        
        fireEvent.changeText(screen.getByPlaceholderText('Enter your email address'), 'test@email.com');
        fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'incorrectPassword');
        
        fireEvent.press(screen.getAllByText('Login')[1]);

        await waitFor(() => {
            expect(screen.getByText('Incorrect password')).toBeTruthy();
        });
    });
});
