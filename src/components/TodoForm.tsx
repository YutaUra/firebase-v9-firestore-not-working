import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BaseTodoType } from '../models/todo'

type TodoFormField = BaseTodoType

type TodoFormProps = {
  defaultValues?: TodoFormField
  onSubmit?: (data: TodoFormField) => Promise<void> | void
  onCancel?: () => void
}

export const TodoForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: TodoFormProps) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormField>({
    defaultValues,
  })

  const onSubmitWrapper = useCallback<SubmitHandler<TodoFormField>>(
    async (data) => {
      onSubmit && (await onSubmit(data))
      reset()
    },
    [onSubmit],
  )

  const onCancelWrapper = useCallback(() => {
    reset()
    onCancel && onCancel()
  }, [onCancel])

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)}>
      <Stack spacing="4">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input {...register('name')} />
          {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Input {...register('description')} />
          {errors.description && (
            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
          )}
        </FormControl>
        <HStack justifyContent="flex-end">
          <Button type="submit" colorScheme="green">
            SUBMIT
          </Button>
          <Button onClick={onCancelWrapper} colorScheme="gray">
            CANCEL
          </Button>
        </HStack>
      </Stack>
    </form>
  )
}
