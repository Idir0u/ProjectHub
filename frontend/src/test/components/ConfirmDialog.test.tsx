import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../../components/ConfirmDialog'

describe('ConfirmDialog Component', () => {
  const mockConfirm = vi.fn()
  const mockCancel = vi.fn()

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('renders with correct title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument()
  })

  it('renders with custom button text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Are you sure?"
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
    expect(screen.getByText('No, Keep')).toBeInTheDocument()
  })

  it('renders with default button text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)
    
    expect(mockConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockCancel).toHaveBeenCalled()
  })

  it('applies correct styling for error type', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Error"
        message="Error message"
        type="error"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('btn-error')
  })

  it('applies correct styling for warning type', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Warning"
        message="Warning message"
        type="warning"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('btn-warning')
  })

  it('applies correct styling for success type', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Success"
        message="Success message"
        type="success"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('btn-success')
  })

  it('applies correct styling for info type', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Info"
        message="Info message"
        type="info"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    )
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('btn-info')
  })
})
