import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NewPool } from '../screens/NewPool'
import { Pools } from '../screens/Pools'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { FindPool } from '../screens/FindPool'
import { PoolDetails } from '../screens/PoolDetails'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
    const { colors, sizes } = useTheme()

    const size = sizes[6]

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[900],
            },
            tabBarItemStyle: {
            }
        }}>
            <Screen
                name="newPool"
                component={NewPool}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo bolão'
                }}
            />

            <Screen
                name="pools"
                component={Pools}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: 'Meus bolões'
                }}
            />

            <Screen
                name="findPool"
                component={FindPool}
                options={{
                    tabBarButton: () => null
                }}
            />

            <Screen
                name="poolDetails"
                component={PoolDetails}
                options={{
                    tabBarButton: () => null
                }}
            />
        </Navigator>
    )
}