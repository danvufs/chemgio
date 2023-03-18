// Importing necessary modules
import { AppDispatch, RootState } from './../store/store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Exporting custom hooks to provide type checking for the useDispatch and useSelector hooks from the react-redux library
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
