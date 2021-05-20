import { Box, Code, Container, Heading, Text } from '@chakra-ui/layout'
import { useEffect } from 'react'
import { TodoTable } from '../components/TodoTable'
import { useTodo } from '../store/todo'

const Index = () => {
  const { fetchTodos } = useTodo()

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <Box w="100vw" minH="100vh" bg="gray.100">
      <Container py="6" maxW="container.lg">
        <Heading>Firebase v9 firestore not working</Heading>
        <Text>
          Methods such as addDoc are not executed, no error is generated, and it
          doesn't proceed to the next line
        </Text>
        <Code bg="gray.200" p="2" rounded="sm" w="full" lineHeight="2">
          {
            'git clone https://github.com/YutaUra/firebase-v9-firestore-not-working.git'
          }
          <br />
          {'cd firebase-v9-firestore-not-working'}
          <br />
          {'yarn'}
          <br />
          {'yarn dev'}
        </Code>
      </Container>
      <Container maxW="container.xl">
        <TodoTable />
      </Container>
    </Box>
  )
}

export default Index
