/**
 * Modal Component Tests
 *
 * Note: To run these tests, first install Jest and React Testing Library:
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
 *
 * Then add to package.json:
 * "test": "jest",
 * "test:watch": "jest --watch"
 *
 * And create jest.config.js with Next.js support.
 */

import React from 'react'
// Commenting out imports until testing libraries are installed
// import { render, screen, fireEvent } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

/**
 * Test Suite: Modal Component
 *
 * Tests should verify:
 * - Modal renders nothing when isOpen=false
 * - Modal renders content when isOpen=true
 * - Modal renders title and close button when title provided
 * - Close button calls onClose callback
 * - Backdrop click calls onClose callback
 * - Content click does not close modal (stopPropagation)
 * - Modal has proper accessibility attributes (aria-modal, role="dialog")
 * - Header is only rendered when title is provided
 * - Content area is scrollable
 * - Close button is accessible with aria-label
 */

describe('Modal', () => {
  describe('Visibility', () => {
    // it('renders nothing when isOpen is false', () => {
    //   const { container } = render(
    //     <Modal isOpen={false} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   expect(container.firstChild).toBeNull()
    // })

    // it('renders modal when isOpen is true', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Modal content
    //     </Modal>
    //   )
    //   expect(screen.getByText('Modal content')).toBeInTheDocument()
    // })

    // it('renders backdrop when isOpen is true', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const backdrop = container.querySelector('[aria-hidden="true"]')
    //   expect(backdrop).toBeInTheDocument()
    // })
  })

  describe('Title and Header', () => {
    // it('renders header with title when title prop is provided', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}} title="Modal Title">
    //       Content
    //     </Modal>
    //   )
    //   expect(screen.getByText('Modal Title')).toBeInTheDocument()
    // })

    // it('does not render header when title prop is not provided', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const header = container.querySelector('[class*="border-b"]')
    //   expect(header).not.toBeInTheDocument()
    // })

    // it('renders close button in header', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}} title="Title">
    //       Content
    //     </Modal>
    //   )
    //   const closeButton = screen.getByLabelText('Close modal')
    //   expect(closeButton).toBeInTheDocument()
    //   expect(closeButton).toHaveTextContent('✕')
    // })
  })

  describe('Callbacks', () => {
    // it('calls onClose when close button is clicked', async () => {
    //   const onClose = jest.fn()
    //   render(
    //     <Modal isOpen={true} onClose={onClose} title="Title">
    //       Content
    //     </Modal>
    //   )
    //   const closeButton = screen.getByLabelText('Close modal')
    //   await userEvent.click(closeButton)
    //   expect(onClose).toHaveBeenCalledTimes(1)
    // })

    // it('calls onClose when backdrop is clicked', async () => {
    //   const onClose = jest.fn()
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={onClose}>
    //       Content
    //     </Modal>
    //   )
    //   const backdrop = container.querySelector('[aria-hidden="true"]')
    //   await userEvent.click(backdrop!)
    //   expect(onClose).toHaveBeenCalledTimes(1)
    // })

    // it('does not close modal when content is clicked', async () => {
    //   const onClose = jest.fn()
    //   render(
    //     <Modal isOpen={true} onClose={onClose}>
    //       <div data-testid="modal-content">Modal content</div>
    //     </Modal>
    //   )
    //   const content = screen.getByTestId('modal-content')
    //   await userEvent.click(content)
    //   expect(onClose).not.toHaveBeenCalled()
    // })
  })

  describe('Content', () => {
    // it('renders children content', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       <p>Test content</p>
    //     </Modal>
    //   )
    //   expect(screen.getByText('Test content')).toBeInTheDocument()
    // })

    // it('renders multiple children', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       <div>Line 1</div>
    //       <div>Line 2</div>
    //     </Modal>
    //   )
    //   expect(screen.getByText('Line 1')).toBeInTheDocument()
    //   expect(screen.getByText('Line 2')).toBeInTheDocument()
    // })
  })

  describe('Accessibility', () => {
    // it('has proper dialog role', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const dialog = container.querySelector('[role="dialog"]')
    //   expect(dialog).toBeInTheDocument()
    // })

    // it('has aria-modal="true"', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const dialog = container.querySelector('[aria-modal="true"]')
    //   expect(dialog).toBeInTheDocument()
    // })

    // it('close button has aria-label', () => {
    //   render(
    //     <Modal isOpen={true} onClose={() => {}} title="Title">
    //       Content
    //     </Modal>
    //   )
    //   const closeButton = screen.getByLabelText('Close modal')
    //   expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
    // })

    // it('backdrop has aria-hidden="true"', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const backdrop = container.querySelector('[aria-hidden="true"]')
    //   expect(backdrop).toHaveAttribute('aria-hidden', 'true')
    // })
  })

  describe('Styling', () => {
    // it('applies fixed positioning and z-index layering', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const backdrop = container.querySelector('[aria-hidden="true"]')
    //   const dialog = container.querySelector('[role="dialog"]')
    //   expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-40')
    //   expect(dialog).toHaveClass('fixed', 'inset-0', 'z-50')
    // })

    // it('applies white background to modal', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const modal = container.querySelector('[role="dialog"]')
    //   expect(modal).toHaveClass('bg-white')
    // })

    // it('applies rounded-lg border radius', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const modal = container.querySelector('[role="dialog"]')
    //   expect(modal).toHaveClass('rounded-lg')
    // })

    // it('applies shadow-lg for depth', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const modal = container.querySelector('[role="dialog"]')
    //   expect(modal).toHaveClass('shadow-lg')
    // })

    // it('backdrop has black/40 opacity', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const backdrop = container.querySelector('[aria-hidden="true"]')
    //   expect(backdrop).toHaveClass('bg-black/40')
    // })
  })

  describe('Responsive Behavior', () => {
    // it('applies items-end on mobile (bottom sheet)', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const container_div = container.querySelector('[role="dialog"]')?.parentElement
    //   expect(container_div).toHaveClass('items-end')
    // })

    // it('applies md:items-center for desktop centering', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const container_div = container.querySelector('[role="dialog"]')?.parentElement
    //   expect(container_div).toHaveClass('md:items-center')
    // })

    // it('applies md:justify-center for horizontal centering', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const container_div = container.querySelector('[role="dialog"]')?.parentElement
    //   expect(container_div).toHaveClass('md:justify-center')
    // })

    // it('applies w-full on mobile', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const modal = container.querySelector('[role="dialog"]')
    //   expect(modal).toHaveClass('w-full')
    // })

    // it('applies md:max-w-md for desktop width constraint', () => {
    //   const { container } = render(
    //     <Modal isOpen={true} onClose={() => {}}>
    //       Content
    //     </Modal>
    //   )
    //   const modal = container.querySelector('[role="dialog"]')
    //   expect(modal).toHaveClass('md:max-w-md')
    // })
  })
})

export {}
