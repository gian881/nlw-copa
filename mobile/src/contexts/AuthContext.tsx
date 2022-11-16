import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from 'expo-secure-store'
import { api } from "../services/api";

async function getValueFor(key: string) {
    const result = await SecureStore.getItemAsync(key);
    return result
}


WebBrowser.maybeCompleteAuthSession()

interface UserProps {
    name: string
    avatarUrl: string
}

export interface AuthContextDataProps {
    user: UserProps
    isUserLoading: boolean
    signIn: () => Promise<void>
    trySignIn: () => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps)
    const [isUserLoading, setIsUserLoading] = useState(false)

    const tokenFromSecureStore = getValueFor('token')

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    async function trySignIn() {
        if (tokenFromSecureStore !== null) {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${await tokenFromSecureStore}`
                const userInfoResponse = await api.get('/me')
                setUser(userInfoResponse.data.user)
            } catch (error) {
                throw error
            }
        }
    }

    async function signInWithGoogle(access_token: string) {
        try {
            setIsUserLoading(true)

            const tokenResponse = await api.post('/users', { access_token })
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`
            await SecureStore.setItemAsync('token', tokenResponse.data.token)

            const userInfoResponse = await api.get('/me')
            setUser(userInfoResponse.data.user)
        } catch (error) {
            throw error
        } finally {
            setIsUserLoading(false)
        }
    }

    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response])

    async function signIn() {
        try {
            setIsUserLoading(true)
            await promptAsync()
        } catch (error) {
            console.log(error);
        } finally {
            setIsUserLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{
            trySignIn,
            signIn,
            isUserLoading,
            user
        }
        }>
            {children}
        </AuthContext.Provider >
    )
}