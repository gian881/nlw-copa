import { VStack, Heading, Text, useToast } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';


interface FindPoolProps {

}

export function FindPool({ }: FindPoolProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')

    const { navigate } = useNavigation()
    const toast = useToast()

    async function handleJoinPull() {
        try {
            setIsLoading(true)

            if (!code.trim()) {
                return toast.show({
                    title: 'Digite o código do bolão.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            await api.post('/pools/join', { code })
            setIsLoading(false)

            toast.show({
                title: 'Você entrou no bolão com sucesso.',
                placement: 'top',
                bgColor: 'green.500'
            })

            navigate('pools')
        } catch (error) {
            setIsLoading(true)

            if (error.response?.data?.message === "Pool not found.") {
                return toast.show({
                    title: 'Bolão não encontrado.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if (error.response?.data?.message === "You already joined this pool.") {
                return toast.show({
                    title: 'Você já está participando deste bolão.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            toast.show({
                title: 'Não foi possível entrar no bolão.',
                placement: 'top',
                bgColor: 'red.500'
            })

        }
    }
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de{'\n'}
                    seu código único
                </Heading>
                <Input mb={2} placeholder="Qual o código do bolão?" onChangeText={setCode} value={code} autoCapitalize="characters" />
                <Button title="BUSCAR BOLÃO" onPress={handleJoinPull} />
            </VStack>
        </VStack>
    )
}