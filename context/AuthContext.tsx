import React, {createContext, useState, useContext, ReactNode, useMemo, useEffect} from 'react';
import { fetchUserAttributes, getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { useActiveUserStore } from '@/hooks/useActiveUser';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: string | null;
  login: (
    username: string,
    password: string,
    setLoading: (loading: boolean) => void,
    setFieldError: (field: string, errorMsg: string) => void
  ) => Promise<void>;
  logout: () => Promise<void>;
  dynamoClient: DynamoDBClient; // ✅ exposed for global use
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string>('');
    const router = useRouter();
    const { setActiveUser } = useActiveUserStore();

    const TABLE1 = 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
    const TABLE2 = 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
    const TABLE3 = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging';
    const TABLE4 = 'Match-ycmuiolpezdtdkkxmiwibhh6e4-staging';

    const dynamoClient = new DynamoDBClient({
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
        },
    });

    async function checkRole(userSub: string) {
        const attributes = await fetchUserAttributes();
        const userRole = attributes['custom:role']
        console.log('Role: ' + userRole);

        if(userRole === "NotSet"){
            router.push('/onboarding/welcome/start');
        } else if (userRole === "Client"){
            await checkClientOnboarding()
        } else if(userRole === "PT"){
            await checkTrainerOnboarding(userSub)
        }
    }

    const login = async (username: string, password: string, setLoading: (loading: boolean) => void,
                         setFieldError: (field: string, errorMsg: string) => void) => {
        setActiveUser(null);
        setLoading(true)
        try {
            const { isSignedIn, nextStep } = await signIn({ username: username, password: password, options: {
                    authFlowType: "USER_PASSWORD_AUTH",
                }, });

            if (nextStep.signInStep === 'DONE') {
                const {username} = await getCurrentUser();
                setUser(username);           // return user sub/id in Cognito
            }
        } catch (error: any) {
            const defaultError = 'An unknown error occurred';
            console.error(error);
            switch (error.name) {
              case 'AuthTokenConfigException':
                setFieldError('username', 'Authentication token configuration issue');
                break;
              case 'ReferenceError':
                setFieldError('username', 'Reference Error');
                break;
              case 'UserNotFoundException':
                setFieldError('username', 'Email does not exist');
                break;
              case 'NotAuthorizedException':
                setFieldError('password', 'Incorrect password');
                break;
              case 'UserNotConfirmedException':
                setFieldError('username', 'Email is not confirmed');
                break;
              default:
                setFieldError('username', defaultError);
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const {username} = await getCurrentUser();
                console.info('User session already active:', username);
                setUser(username);
                checkRole(username)
            } catch (err: any) {
                console.warn('Auth check failed:', err.message || err);
            }
        }
        checkCurrentUser();
    }, [user]);

    // useEffect(() => {
    //     console.log('User: ', user);
    //     checkRole();
    // }, [user]);


    async function checkClientOnboarding() {
        const params1 = {
            TableName: TABLE1,
        };
        const params2 = {
            TableName: TABLE2,
        };
        const params3 = {
            TableName: TABLE4,
        };

        const command1 = new ScanCommand(params1); // Scan the DynamoDB table
        const data1 = await dynamoClient.send(command1);
        const items1 = data1.Items?.map(item => ({
          sub: item.sub?.S,
        }));

        const command2 = new ScanCommand(params2); // Scan the DynamoDB table
        const data2 = await dynamoClient.send(command2);
        const items2 = data2.Items?.map(item => ({
          sub: item.sub?.S,
        }));

        const command3 = new ScanCommand(params3); // Scan the DynamoDB table
        const data3 = await dynamoClient.send(command3);
        const items3 = data3.Items?.map(item => {
            // Map over items and return the desired format
            return {
                onlineclientID: item.onlineclientID?.S,
                inpersonclientID: item.inpersonclientID?.S
            };
        });

        console.log(items3);
        const find1 = items1?.find((item) => {
            return item.sub === user; // Ensure the result is returned
        });

        const find2 = items2?.find((item) => {
            return item.sub === user; // Ensure the result is returned
        });

        console.log(user);
        // check if client is in match table
        const find3 = items3?.find((item) => {
            return item.onlineclientID === user || item.inpersonclientID === user; // Ensure the result is returned
        });

        console.log(find3);
        // Route to client home if client is already matched
        if (find3) {
            router.push('/clientHome/home');
            return;
        } else {
            // Route to matching page when client already finishes onboarding but havent matched yet
            if (find1) {
                router.replace('/onboarding/client/inPerson/matchLocation');
            } else if (find2) {
                router.replace('/onboarding/client/online/match');
            } else {
                console.log("Cant find user in dynamoDB")
                router.push('/onboarding/welcome/start');
            }
        }
    }

  async function checkTrainerOnboarding(userSub: string) {
    const command = new ScanCommand({ TableName: TABLE3 });
    const data = await dynamoClient.send(command);

    const items = data.Items?.map(item => ({
      sub: item.sub?.S,
      isApproved: item.isApproved?.BOOL,
    }));

    const found = items?.find((item) => {
        return item.sub === userSub; // Ensure the result is returned
    });

    if (found) {
      setActiveUser(found);
      router.push('/trainerHome/home-screen');
    } else {
      router.push('/onboarding/welcome/start');
    }
  }

  const logout = async () => {
    setUser('');
    await signOut();
    router.push('/auth/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, dynamoClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};