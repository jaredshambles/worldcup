/**
 * Card Component Tests
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
import { Card } from '../Card'

/**
 * Test Suite: Card Component
 *
 * Tests should verify:
 * - Renders children content
 * - Applies default variant classes correctly
 * - Applies highlight variant classes correctly
 * - Applies urgency variant classes correctly
 * - Applies achievement variant classes correctly
 * - Applies error variant classes correctly
 * - Interactive variant shows hover styling (only on default variant)
 * - Supports custom className prop
 * - Non-interactive variants don't apply hover effects
 */

describe('Card', () => {
  describe('Rendering', () => {
    // it('renders children content', () => {
    //   render(<Card>Card content</Card>)
    //   expect(screen.getByText('Card content')).toBeInTheDocument()
    // })

    // it('renders with multiple children', () => {
    //   render(
    //     <Card>
    //       <div>Line 1</div>
    //       <div>Line 2</div>
    //     </Card>
    //   )
    //   expect(screen.getByText('Line 1')).toBeInTheDocument()
    //   expect(screen.getByText('Line 2')).toBeInTheDocument()
    // })
  })

  describe('Variants', () => {
    // it('applies default variant classes correctly', () => {
    //   render(<Card variant="default">Default</Card>)
    //   const card = screen.getByText('Default').parentElement
    //   expect(card).toHaveClass('bg-white', 'border-border', 'rounded-md', 'p-3', 'border')
    // })

    // it('applies highlight variant classes correctly', () => {
    //   render(<Card variant="highlight">Highlight</Card>)
    //   const card = screen.getByText('Highlight').parentElement
    //   expect(card).toHaveClass('bg-highlight-bg', 'border-highlight-border')
    // })

    // it('applies urgency variant classes correctly', () => {
    //   render(<Card variant="urgency">Urgency</Card>)
    //   const card = screen.getByText('Urgency').parentElement
    //   expect(card).toHaveClass('bg-urgency-bg', 'border-urgency-border')
    // })

    // it('applies achievement variant classes correctly', () => {
    //   render(<Card variant="achievement">Achievement</Card>)
    //   const card = screen.getByText('Achievement').parentElement
    //   expect(card).toHaveClass('bg-achievement-bg', 'border-achievement-border')
    // })

    // it('applies error variant classes correctly', () => {
    //   render(<Card variant="error">Error</Card>)
    //   const card = screen.getByText('Error').parentElement
    //   expect(card).toHaveClass('bg-error-bg', 'border-danger')
    // })
  })

  describe('Interactive', () => {
    // it('applies interactive classes to default variant', () => {
    //   render(
    //     <Card variant="default" interactive>
    //       Interactive
    //     </Card>
    //   )
    //   const card = screen.getByText('Interactive').parentElement
    //   expect(card).toHaveClass('cursor-pointer', 'hover:bg-surface-hover', 'shadow-hover')
    // })

    // it('does not apply interactive classes to highlight variant', () => {
    //   render(
    //     <Card variant="highlight" interactive>
    //       Not Interactive
    //     </Card>
    //   )
    //   const card = screen.getByText('Not Interactive').parentElement
    //   expect(card).not.toHaveClass('cursor-pointer', 'hover:bg-surface-hover')
    // })

    // it('does not apply interactive classes to urgency variant', () => {
    //   render(
    //     <Card variant="urgency" interactive>
    //       Not Interactive
    //     </Card>
    //   )
    //   const card = screen.getByText('Not Interactive').parentElement
    //   expect(card).not.toHaveClass('cursor-pointer', 'hover:bg-surface-hover')
    // })

    // it('does not apply interactive classes to achievement variant', () => {
    //   render(
    //     <Card variant="achievement" interactive>
    //       Not Interactive
    //     </Card>
    //   )
    //   const card = screen.getByText('Not Interactive').parentElement
    //   expect(card).not.toHaveClass('cursor-pointer', 'hover:bg-surface-hover')
    // })

    // it('does not apply interactive classes to error variant', () => {
    //   render(
    //     <Card variant="error" interactive>
    //       Not Interactive
    //     </Card>
    //   )
    //   const card = screen.getByText('Not Interactive').parentElement
    //   expect(card).not.toHaveClass('cursor-pointer', 'hover:bg-surface-hover')
    // })
  })

  describe('Custom Props', () => {
    // it('supports custom className prop', () => {
    //   render(
    //     <Card className="custom-class">
    //       Custom
    //     </Card>
    //   )
    //   const card = screen.getByText('Custom').parentElement
    //   expect(card).toHaveClass('custom-class')
    // })

    // it('supports custom data attributes', () => {
    //   render(
    //     <Card data-testid="custom-card">
    //       Data Attr
    //     </Card>
    //   )
    //   expect(screen.getByTestId('custom-card')).toBeInTheDocument()
    // })

    // it('supports HTML div attributes', () => {
    //   const { container } = render(
    //     <Card id="card-id" title="Card Title">
    //       Content
    //     </Card>
    //   )
    //   const card = container.querySelector('#card-id')
    //   expect(card).toHaveAttribute('title', 'Card Title')
    // })
  })

  describe('Styling', () => {
    // it('always applies base classes', () => {
    //   render(<Card>Base</Card>)
    //   const card = screen.getByText('Base').parentElement
    //   expect(card).toHaveClass('rounded-md', 'p-3', 'border', 'transition-colors', 'duration-200')
    // })

    // it('applies padding md (12px/p-3)', () => {
    //   render(<Card>Padded</Card>)
    //   const card = screen.getByText('Padded').parentElement
    //   expect(card).toHaveClass('p-3')
    // })

    // it('applies border radius md (6px/rounded-md)', () => {
    //   render(<Card>Rounded</Card>)
    //   const card = screen.getByText('Rounded').parentElement
    //   expect(card).toHaveClass('rounded-md')
    // })
  })
})

export {}
