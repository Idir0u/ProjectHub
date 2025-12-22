import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Toast, { ToastMessage } from '../../components/Toast'

describe('Toast Component', () => {
  const mockDismiss = vi.fn()
  
  const successToast: ToastMessage = {
    id: '1',
    message: 'Success message',
    type: 'success'
  }

  const errorToast: ToastMessage = {
    id: '2',
    message: 'Error message',
    type: 'error'
  }

  const warningToast: ToastMessage = {
    id: '3',
    message: 'Warning message',
    type: 'warning'
  }

  const infoToast: ToastMessage = {
    id: '4',
    message: 'Info message',
    type: 'info'
  }

  it('renders success toast with correct styling', () => {
    render(<Toast message={successToast} onDismiss={mockDismiss} />)
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    const alert = screen.getByText('Success message').closest('.alert')
    expect(alert).toHaveClass('alert-success')
  })

  it('renders error toast with correct styling', () => {
    render(<Toast message={errorToast} onDismiss={mockDismiss} />)
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
    const alert = screen.getByText('Error message').closest('.alert')
    expect(alert).toHaveClass('alert-error')
  })

  it('renders warning toast with correct styling', () => {
    render(<Toast message={warningToast} onDismiss={mockDismiss} />)
    
    expect(screen.getByText('Warning message')).toBeInTheDocument()
    const alert = screen.getByText('Warning message').closest('.alert')
    expect(alert).toHaveClass('alert-warning')
  })

  it('renders info toast with correct styling', () => {
    render(<Toast message={infoToast} onDismiss={mockDismiss} />)
    
    expect(screen.getByText('Info message')).toBeInTheDocument()
    const alert = screen.getByText('Info message').closest('.alert')
    expect(alert).toHaveClass('alert-info')
  })

  it('calls onDismiss when close button is clicked', () => {
    render(<Toast message={successToast} onDismiss={mockDismiss} />)
    
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    
    expect(mockDismiss).toHaveBeenCalledWith('1')
  })

  it('auto-dismisses after 5 seconds', async () => {
    vi.useFakeTimers()
    const mockDismiss2 = vi.fn()
    render(<Toast message={successToast} onDismiss={mockDismiss2} />)
    
    expect(mockDismiss2).not.toHaveBeenCalled()
    
    // Fast-forward time by 5 seconds
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    
    // Check if onDismiss was called
    expect(mockDismiss2).toHaveBeenCalledWith('1')
    
    vi.useRealTimers()
  })
})
