import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { atom, atomFamily, useRecoilCallback } from 'recoil'
import {
  BaseTodoSchema,
  BaseTodoType,
  TodoSchema,
  TodoType,
} from '../models/todo'
import { FirebaseFirestoreSelector } from './firebase'

export const TodoAtoms = atomFamily<
  BaseTodoType & { createdAt: Date; updatedAt: Date },
  string
>({
  key: 'TodoAtoms',
  default: {
    name: '',
    description: '',
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
})

export const TodoIdsAtom = atom<string[]>({
  key: 'TodoIdsAtom',
  default: [],
})

export const useTodo = () => {
  const fetchTodos = useRecoilCallback(
    ({ set, snapshot: { getPromise } }) =>
      async () => {
        // Use recoil to get the object of firestore
        const db = await getPromise(FirebaseFirestoreSelector)
        const res = await getDocs(collection(db, 'todos'))
        const validatedData = res.docs
          .map((v) => ({
            id: v.id,
            data: TodoSchema.safeParse(v.data()),
          }))
          .filter(
            (v): v is { id: string; data: { success: true; data: TodoType } } =>
              v.data.success,
          )
        validatedData.forEach(({ id, data: { data } }) => {
          set(TodoAtoms(id), {
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          })
        })
        set(
          TodoIdsAtom,
          validatedData.map((v) => v.id),
        )
      },
    [],
  )

  const createTodo = useRecoilCallback(
    ({ set, snapshot: { getPromise } }) =>
      async (rawdata: BaseTodoType) => {
        const data = BaseTodoSchema.parse(rawdata)
        const db = await getPromise(FirebaseFirestoreSelector)
        const ref = await addDoc(collection(db, 'todos'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        const res = await getDoc(ref)
        const todo = TodoSchema.parse(res.data())
        set(TodoAtoms(res.id), {
          ...todo,
          createdAt: todo.createdAt.toDate(),
          updatedAt: todo.updatedAt.toDate(),
        })
        set(TodoIdsAtom, (values) => [...values, res.id])
        return res.id
      },
    [],
  )

  const updateTodo = useRecoilCallback(
    ({ set, snapshot: { getPromise } }) =>
      async (id: string, rawdata: Partial<BaseTodoType>) => {
        const data = BaseTodoSchema.partial().parse(rawdata)
        const db = await getPromise(FirebaseFirestoreSelector)
        const ref = doc(db, 'todos', id)
        await updateDoc(ref, {
          ...data,
          updatedAt: serverTimestamp(),
        })
        const res = await getDoc(ref)
        const todo = TodoSchema.parse(res.data())
        set(TodoAtoms(res.id), {
          ...todo,
          createdAt: todo.createdAt.toDate(),
          updatedAt: todo.updatedAt.toDate(),
        })
      },
    [],
  )

  const deleteTodo = useRecoilCallback(
    ({ set, reset, snapshot: { getPromise } }) =>
      async (id: string) => {
        const db = await getPromise(FirebaseFirestoreSelector)
        const ref = doc(db, 'todos', id)
        await deleteDoc(ref)
        reset(TodoAtoms(id))
        set(TodoIdsAtom, (values) => values.filter((v) => v !== id))
      },
    [],
  )

  return {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  }
}
