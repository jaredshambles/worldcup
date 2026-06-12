/**
 * Badge Component Tests
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
// import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

/**
 * Test Suite: Badge Component
 *
 * Tests should verify:
 * - Renders children content
 * - Applies default variant classes correctly
 * - Applies success variant classes correctly
 * - Applies warning variant classes correctly
 * - Applies danger variant classes correctly
 * - Applies info variant classes correctly
 * - Icon renders when provided
 * - Supports custom className prop
 */

describe('Badge', () => {
  describe('Rendering', () => {
    // it('renders children content', () => {
    //   render(<Badge>Badge text</Badge>)
    //   expect(screen.getByText('Badge text')).toBeInTheDocument()
    // })

    // it('renders with icon and children', () => {
    //   render(
    //     <Badge icon="🏆">
    //       Achievement
    //     </Badge>
    //   )
    //   expect(screen.getByText('Achievement')).toBeInTheDocument()
    // })
  })

  describe('Variants', () => {
    // it('applies default variant classes correctly', () => {
    //   render(<Badge variant="default">Default</Badge>)
    //   const badge = screen.getByText('Default')
    //   expect(badge).toHaveClass('bg-surface', 'border-border', 'text-text-primary')
    // })

    // it('applies success variant classes correctly', () => {
    //   render(<Badge variant="success">Success</Badge>)
    //   const badge = screen.getByText('Success')
    //   expect(badge).toHaveClass('bg-highlight-bg', 'border-highlight-border', 'text-success')
    // })

    // it('applies warning variant classes correctly', () => {
    //   render(<Badge variant="warning">Warning</Badge>)
    //   const badge = screen.getByText('Warning')
    //   expect(badge).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-warning')
    // })

    // it('applies danger variant classes correctly', () => {
    //   render(<Badge variant="danger">Danger</Badge>)
    //   const badge = screen.getByText('Danger')
    //   expect(badge).toHaveClass('bg-error-bg', 'border-danger', 'text-danger')
    // })

    // it('applies info variant classes correctly', () => {
    //   render(<Badge variant="info">Info</Badge>)
    //   const badge = screen.getByText('Info')
    //   expect(badge).toHaveClass('bg-achievement-bg', 'border-achievement-border', 'text-achievement-text')
    // })
  })

  describe('Icon', () => {
    // it('renders icon when provided', () => {
    //   render(
    //     <Badge icon="⭐">
    //       Star
    //     </Badge>
    //   )
    //   expect(screen.getByText('⭐')).toBeInTheDocument()
    //   expect(screen.getByText('Star')).toBeInTheDocument()
    // })

    // it('does not render icon slot when not provided', () => {
    //   const { container } = render(<Badge>No Icon</Badge>)
    //   expect(screen.getByText('No Icon')).toBeInTheDocument()
    //   // Icon span should not be in DOM
    // })

    // it('renders icon before text content', () => {
    //   const { container } = render(
    //     <Badge icon="🎖️">
    //       Medal
    //     </Badge>
    //   )
    //   const badge = screen.getByText('Medal').parentElement
    //   const children = badge?.children
    //   expect(children?.[0].textContent).toContain('🎖️')
    //   expect(children?.[1].textContent).toContain('Medal')
    // })
  })

  describe('Custom Props', () => {
    // it('supports custom className prop', () => {
    //   render(
    //     <Badge className="custom-class">
    //       Custom
    //     </Badge>
    //   )
    //   const badge = screen.getByText('Custom')
    //   expect(badge).toHaveClass('custom-class')
    // })

    // it('supports custom data attributes', () => {
    //   render(
    //     <Badge data-testid="custom-badge">
    //       Data Attr
    //     </Badge>
    //   )
    //   expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    // })

    // it('supports HTML span attributes', () => {
    //   const { container } = render(
    //     <Badge id="badge-id" title="Badge Title">
    //       Content
    //     </Badge>
    //   )
    //   const badge = container.querySelector('#badge-id')
    //   expect(badge).toHaveAttribute('title', 'Badge Title')
    // })
  })

  describe('Styling', () => {
    // it('always applies base classes', () => {
    //   render(<Badge>Base</Badge>)
    //   const badge = screen.getByText('Base')
    //   expect(badge).toHaveClass('inline-flex', 'items-center', 'gap-1', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-sm', 'border')
    // })

    // it('applies xs text size (10px/text-xs)', () => {
    //   render(<Badge>Text</Badge>)
    //   const badge = screen.getByText('Text')
    //   expect(badge).toHaveClass('text-xs')
    // })

    // it('applies semibold font weight', () => {
    //   render(<Badge>Font</Badge>)
    //   const badge = screen.getByText('Font')
    //   expect(badge).toHaveClass('font-semibold')
    // })

    // it('applies sm border radius (4px/rounded-sm)', () => {
    //   render(<Badge>Radius</Badge>)
    //   const badge = screen.getByText('Radius')
    //   expect(badge).toHaveClass('rounded-sm')
    // })

    // it('applies 1px border', () => {
    //   render(<Badge>Border</Badge>)
    //   const badge = screen.getByText('Border')
    //   expect(badge).toHaveClass('border')
    // })
  })
})

export {}
