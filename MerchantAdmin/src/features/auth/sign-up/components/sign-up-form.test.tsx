import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { SignUpForm } from './sign-up-form'

const FORM_MESSAGES = {
  phoneEmpty: '请输入手机号。',
  passwordEmpty: '请输入密码。',
  confirmPasswordEmpty: '请再次输入密码。',
  passwordMismatch: '两次输入的密码不一致。',
} as const

const toastPromise = vi.hoisted(() =>
  vi.fn((p: Promise<unknown>, opts: { success?: () => unknown }) => {
    p.then(() => opts.success?.())
  })
)

vi.mock('sonner', () => ({ toast: { promise: toastPromise } }))

describe('SignUpForm', () => {
  let screen: RenderResult
  let phoneInput: Locator
  let passwordInput: Locator
  let confirmPasswordInput: Locator
  let submitButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<SignUpForm />)
    phoneInput = screen.getByRole('textbox', { name: /^手机号$/ })
    passwordInput = screen.getByLabelText(/^密码$/)
    confirmPasswordInput = screen.getByLabelText(/^确认密码$/)
    submitButton = screen.getByRole('button', { name: /^注册账号$/ })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders fields and submit button', async () => {
    await expect.element(phoneInput).toBeInTheDocument()
    await expect.element(passwordInput).toBeInTheDocument()
    await expect.element(confirmPasswordInput).toBeInTheDocument()
    await expect.element(submitButton).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    await userEvent.click(submitButton)

    await expect
      .element(screen.getByText(FORM_MESSAGES.phoneEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.confirmPasswordEmpty))
      .toBeInTheDocument()
  })

  it('shows a mismatch error when passwords do not match', async () => {
    await userEvent.fill(phoneInput, '13800138000')
    await userEvent.fill(passwordInput, '1234567')
    await userEvent.fill(confirmPasswordInput, '7654321')

    await userEvent.click(submitButton)
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordMismatch))
      .toBeInTheDocument()
  })

  it('disables submit while submitting and re-enables after timeout', async () => {
    vi.useFakeTimers()

    await userEvent.fill(phoneInput, '13800138000')
    await userEvent.fill(passwordInput, '1234567')
    await userEvent.fill(confirmPasswordInput, '1234567')

    await userEvent.click(submitButton)
    await expect.element(submitButton).toBeDisabled()

    await vi.advanceTimersByTimeAsync(2000)
    await expect.element(submitButton).toBeEnabled()
    expect(toastPromise).toHaveBeenCalledOnce()
  })
})
