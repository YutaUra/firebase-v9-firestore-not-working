import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { BaseTodoType } from '../models/todo'
import { TodoAtoms, TodoIdsAtom, useTodo } from '../store/todo'
import { TodoForm } from './TodoForm'

type UpdateTodoModalProps = {
  id: string
}
const UpdateTodoModal = ({ id }: UpdateTodoModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { updateTodo } = useTodo()
  const { name, description } = useRecoilValue(TodoAtoms(id))

  const onSubmit = useCallback(
    async (data: BaseTodoType) => {
      await updateTodo(id, data)
      onClose()
    },
    [updateTodo, onClose],
  )

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Edit"
        icon={<EditIcon />}
        colorScheme="green"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TodoForm
              onSubmit={onSubmit}
              onCancel={onClose}
              defaultValues={{ name, description }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

type TodoRowProps = {
  id: string
}
const TodoRow = ({ id }: TodoRowProps) => {
  const { deleteTodo } = useTodo()
  const todo = useRecoilValue(TodoAtoms(id))

  const onClickDelete = useCallback(() => {
    deleteTodo(id)
  }, [deleteTodo, id])

  return (
    <Tr>
      <Td>{todo.name}</Td>
      <Td>{todo.description}</Td>
      <Td>
        <ButtonGroup isAttached variant="outline">
          <UpdateTodoModal id={id} />
          <IconButton
            onClick={onClickDelete}
            aria-label="Delete"
            icon={<DeleteIcon />}
            colorScheme="red"
          />
        </ButtonGroup>
      </Td>
    </Tr>
  )
}

const CreateTodoModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { createTodo } = useTodo()

  const onSubmit = useCallback(
    async (data: BaseTodoType) => {
      await createTodo(data)
      onClose()
    },
    [createTodo, onClose],
  )

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add Todo
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TodoForm onSubmit={onSubmit} onCancel={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const TodoTable = () => {
  const todoIds = useRecoilValue(TodoIdsAtom)

  return (
    <Box>
      <HStack justifyContent="space-between">
        <Heading>Todos</Heading>
        <CreateTodoModal />
      </HStack>

      <Table>
        <Thead>
          <Tr>
            <Th>name</Th>
            <Th>description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {todoIds.map((id) => (
            <TodoRow key={id} id={id} />
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
