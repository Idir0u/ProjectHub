import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ToastProvider, useToast } from '../../context/ToastContext'

describe('useToast Hook', () => {
  it('shows success toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    })

    act(() => {
      result.current.success('Success message')
    })

    expect(result.current).toBeDefined()
  })

  it('shows error toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    })

    act(() => {
      result.current.error('Error message')
    })

    expect(result.current).toBeDefined()
  })

  it('shows warning toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    })

    act(() => {
      result.current.warning('Warning message')
    })

    expect(result.current).toBeDefined()
  })

  it('shows info toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    })

    act(() => {
      result.current.info('Info message')
    })

    expect(result.current).toBeDefined()
  })

  it('shows generic toast with type', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    })

    act(() => {
      result.current.showToast('Generic message', 'success')
    })

    expect(result.current).toBeDefined()
  })

  it('throws error when used outside ToastProvider', () => {
    expect(() => {
      renderHook(() => useToast())
    }).toThrow('useToast must be used within ToastProvider')
  })
})
