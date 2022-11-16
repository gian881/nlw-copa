import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

interface PoolsProps {

}

export function Pools({ }: PoolsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [pools, setPools] = useState<PoolCardProps[]>([])

    const { navigate } = useNavigation()
    const toast = useToast()
    async function fetchPools() {
        try {
            setIsLoading(true)
            const response = await api.get('/pools')
            setPools(response.data.pools)
        } catch (error) {
            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools()
    }, []))

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('findPool')}
                />

            </VStack>
            {isLoading
                ? <Loading />
                : (
                    <FlatList
                        data={pools}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <PoolCard
                                data={item}
                                onPress={() => navigate('poolDetails', { id: item.id })}
                            />)}
                        ListEmptyComponent={() => <EmptyPoolList />}
                        px={5}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{ paddingBottom: 10 }}
                    />
                )}
        </VStack>
    )
}