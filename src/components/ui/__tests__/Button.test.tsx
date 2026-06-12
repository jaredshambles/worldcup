/**
 * Button Component Tests
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
// import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

/**
 * Test Suite: Button Component
 *
 * Tests should verify:
 * - Renders with children text
 * - Applies variant classes correctly (primary, secondary, tertiary, ghost)
 * - Applies size classes correctly (sm, md, lg)
 * - Disables when disabled=true
 * - Shows loading spinner when isLoading=true
 * - Calls onClick handler when clicked
 * - Does not call onClick when disabled or loading
 * - Renders with icon
 * - Applies fullWidth class when fullWidth=true
 * - Has minimum touch target size (44px)
 * - Has focus-visible outline for accessibility
 */

describe('Button', () => {
  describe('Rendering', () => {
    // it('renders with children', () => {
    //   render(<Button>Click me</Button>)
    //   expect(screen.getByText('Click me')).toBeInTheDocument()
    // })

    // it('renders with icon', () => {
    //   render(
    //     <Button icon={<span data-testid="icon">Icon</span>}>
    //       With Icon
    //     </Button>
    //   )
    //   expect(screen.getByTestId('icon')).toBeInTheDocument()
    //   expect(screen.getByText('With Icon')).toBeInTheDocument()
    // })
  })

  describe('Variants', () => {
    // it('applies primary variant classes correctly', () => {
    //   render(<Button variant="primary">Primary</Button>)
    //   const button = screen.getByText('Primary')
    //   expect(button).toHaveClass('bg-danger', 'text-white')
    // })

    // it('applies secondary variant classes correctly', () => {
    //   render(<Button variant="secondary">Secondary</Button>)
    //   const button = screen.getByText('Secondary')
    //   expect(button).toHaveClass('bg-accent-primary', 'text-white')
    // })

    // it('applies tertiary variant classes correctly', () => {
    //   render(<Button variant="tertiary">Tertiary</Button>)
    //   const button = screen.getByText('Tertiary')
    //   expect(button).toHaveClass('bg-surface', 'text-text-primary', 'border')
    // })

    // it('applies ghost variant classes correctly', () => {
    //   render(<Button variant="ghost">Ghost</Button>)
    //   const button = screen.getByText('Ghost')
    //   expect(button).toHaveClass('text-accent-primary')
    // })
  })

  describe('Sizes', () => {
    // it('applies sm size classes correctly', () => {
    //   render(<Button size="sm">Small</Button>)
    //   const button = screen.getByText('Small')
    //   expect(button).toHaveClass('h-9', 'px-3')
    // })

    // it('applies md size classes correctly', () => {
    //   render(<Button size="md">Medium</Button>)
    //   const button = screen.getByText('Medium')
    //   expect(button).toHaveClass('h-11', 'px-4')
    // })

    // it('applies lg size classes correctly', () => {
    //   render(<Button size="lg">Large</Button>)
    //   const button = screen.getByText('Large')
    //   expect(button).toHaveClass('h-12', 'px-6')
    // })
  })

  describe('States', () => {
    // it('disables when disabled=true', () => {
    //   render(<Button disabled>Disabled</Button>)
    //   const button = screen.getByText('Disabled')
    //   expect(button).toBeDisabled()
    //   expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    // })

    // it('shows loading spinner when isLoading=true', () => {
    //   render(<Button isLoading>Loading</Button>)
    //   const button = screen.getByText('Loading')
    //   expect(button).toBeDisabled()
    //   const spinner = button.querySelector('svg')
    //   expect(spinner).toBeInTheDocument()
    //   expect(spinner).toHaveClass('animate-spin')
    // })
  })

  describe('Interactions', () => {
    // it('calls onClick handler when clicked', async () => {
    //   const handleClick = jest.fn()
    //   render(<Button onClick={handleClick}>Click</Button>)
    //   const button = screen.getByText('Click')
    //   await userEvent.click(button)
    //   expect(handleClick).toHaveBeenCalledTimes(1)
    // })

    // it('does not call onClick when disabled', async () => {
    //   const handleClick = jest.fn()
    //   render(
    //     <Button onClick={handleClick} disabled>
    //       Disabled Click
    //     </Button>
    //   )
    //   const button = screen.getByText('Disabled Click')
    //   await userEvent.click(button)
    //   expect(handleClick).not.toHaveBeenCalled()
    // })

    // it('does not call onClick when loading', async () => {
    //   const handleClick = jest.fn()
    //   render(
    //     <Button onClick={handleClick} isLoading>
    //       Loading
    //     </Button>
    //   )
    //   const button = screen.getByText('Loading')
    //   await userEvent.click(button)
    //   expect(handleClick).not.toHaveBeenCalled()
    // })
  })

  describe('Accessibility', () => {
    // it('has minimum touch target size', () => {
    //   render(<Button>Touch Target</Button>)
    //   const button = screen.getByText('Touch Target')
    //   expect(button).toHaveClass('min-h-touch-target', 'min-w-touch-target')
    // })

    // it('has focus-visible outline', () => {
    //   render(<Button>Focusable</Button>)
    //   const button = screen.getByText('Focusable')
    //   expect(button).toHaveClass('focus-visible:outline-2', 'focus-visible:outline-offset-2')
    // })
  })

  describe('Layout', () => {
    // it('applies fullWidth class when fullWidth=true', () => {
    //   render(<Button fullWidth>Full Width</Button>)
    //   const button = screen.getByText('Full Width')
    //   expect(button).toHaveClass('w-full')
    // })
  })
})

export {}
