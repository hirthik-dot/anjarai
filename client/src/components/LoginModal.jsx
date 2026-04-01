// client/src/components/LoginModal.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

// ── Step 1: Name + Phone form ────────────────────────────────────────────────
function StepNamePhone({ onNext, defaultData }) {
  const { API } = useAuth()
  const [form,    setForm]    = useState({ name: defaultData.name || '', phone: defaultData.phone || '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const name  = form.name.trim()
    const phone = form.phone.trim().replace(/\s+/g, '')
    if (name.length < 2) return setError('Please enter your full name.')
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Please enter a valid 10-digit Indian mobile number.')

    setLoading(true)
    try {
      const res  = await fetch(`${API}/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP. Please try again.')
      onNext({ name, phone })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeSlideIn">
      <div className="text-center mb-7">
        <div className="text-5xl mb-3 text-green-600"><i className="fa-solid fa-leaf"></i></div>
        <h2 className="font-head text-[26px] font-bold text-dark leading-tight">
          Welcome to<br /><span className="text-green">Anjaraipetti</span>
        </h2>
        <p className="text-mid text-[13px] mt-2 leading-relaxed">
          Enter your details to receive a login code via SMS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-bold text-dark mb-1.5 uppercase tracking-wide">
            Full Name
          </label>
          <input
            ref={nameRef}
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Priya Sharma"
            required
            className="w-full border-2 border-green-pale rounded-xl px-4 py-3 text-sm font-body
                       outline-none focus:border-green transition-colors placeholder:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-bold text-dark mb-1.5 uppercase tracking-wide">
            Mobile Number
          </label>
          <div className="flex items-center gap-0">
            <span className="inline-flex items-center border-2 border-r-0 border-green-pale rounded-l-xl px-3 py-3 text-sm font-bold text-mid bg-gray-50 select-none">
              +91
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => {
                // Only allow digits, max 10
                const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                setForm(f => ({ ...f, phone: val }))
              }}
              placeholder="9876543210"
              required
              maxLength={10}
              inputMode="numeric"
              className="w-full border-2 border-green-pale rounded-r-xl px-4 py-3 text-sm font-body
                         outline-none focus:border-green transition-colors placeholder:text-gray-300"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-[13px]">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green hover:bg-green-light text-white font-bold rounded-xl py-3.5
                     text-sm transition-colors duration-200 disabled:opacity-60 mt-1
                     flex items-center justify-center gap-2"
        >
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Sending OTP...</>
            : <><i className="fa-solid fa-mobile-screen mr-2"></i> Send OTP via SMS &rarr;</>
          }
        </button>
      </form>

      <p className="text-center text-[11px] text-mid mt-5 leading-relaxed">
        We'll send a 6-digit OTP to your phone via SMS. No password needed.
      </p>
    </div>
  )
}


// ── Step 2: OTP Verification — 6 individual digit boxes ─────────────────────
function StepOtp({ phone, name, onSuccess, onBack }) {
  const { API } = useAuth()
  const [digits,    setDigits]    = useState(['', '', '', '', '', ''])
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const [timer,     setTimer]     = useState(60)
  const inputRefs = useRef([])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    const otp = digits.join('')
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      handleVerify(otp)
    }
  }, [digits]) // eslint-disable-line

  const handleVerify = async (otp) => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone, otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDigits(['', '', '', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 50)
        throw new Error(data.error || 'Incorrect OTP.')
      }
      onSuccess(data.user, data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...digits]
    next[index] = digit
    setDigits(next)
    setError('')
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    setError('')
    setDigits(['', '', '', '', '', ''])
    try {
      const res  = await fetch(`${API}/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResendMsg('New OTP sent!')
      setTimer(60)
      setTimeout(() => setResendMsg(''), 3000)
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  const maskedPhone = phone.replace(/^(\d{2})\d{5}(\d{3})$/, '$1•••••$2')

  return (
    <div className="animate-fadeSlideIn">
      <div className="text-center mb-7">
        <div className="text-5xl mb-3 text-green-600"><i className="fa-solid fa-mobile-screen-button"></i></div>
        <h2 className="font-head text-[24px] font-bold text-dark">Verify your phone</h2>
        <p className="text-mid text-[13px] mt-2 leading-relaxed">
          We sent a 6-digit code to<br />
          <span className="font-bold text-green">+91 {maskedPhone}</span>
        </p>
      </div>

      {/* 6 OTP Digit Boxes */}
      <div className="flex gap-2.5 justify-center mb-5" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={d}
            onChange={e => handleDigitChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={loading}
            className={[
              'w-11 h-14 text-center text-xl font-black rounded-xl border-2 outline-none',
              'transition-all duration-150 font-body',
              d ? 'border-green bg-green-pale text-green' : 'border-green-pale text-dark',
              loading ? 'opacity-50 cursor-not-allowed' : 'focus:border-green focus:bg-green-pale/40',
              error ? 'border-red-300 bg-red-50 animate-shake' : '',
            ].join(' ')}
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 mb-4 text-green text-sm font-semibold">
          <i className="fa-solid fa-spinner fa-spin mr-2"></i> Verifying…
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-[13px] mb-4">
          ⚠️ {error}
        </div>
      )}

      {resendMsg && (
        <div className="bg-green-pale border border-green rounded-xl px-4 py-2 text-green text-[13px] mb-4 text-center font-semibold">
          <i className="fa-solid fa-check text-green-600 mr-1"></i> {resendMsg}
        </div>
      )}

      <div className="flex items-center justify-between text-[12px]">
        <button
          onClick={onBack}
          className="text-mid hover:text-green transition-colors font-semibold"
        >
          ← Change number
        </button>
        {timer > 0 ? (
          <span className="text-mid">Resend in {timer}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-green font-bold hover:text-green-light transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </div>

      <p className="text-center text-[11px] text-mid mt-5 leading-relaxed">
        Didn't get it? Check if your phone has signal or request a new code.
      </p>
    </div>
  )
}


// ── Step 3: Welcome (auto-close) ─────────────────────────────────────────────
function StepWelcome({ name, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="text-center animate-fadeSlideIn py-6">
      <div className="text-6xl mb-4 animate-bounce text-green-600"><i className="fa-solid fa-gift"></i></div>
      <h2 className="font-head text-[28px] font-bold text-green mb-2">
        Welcome, {name.split(' ')[0]}!
      </h2>
      <p className="text-mid text-[14px] leading-relaxed">
        You're now logged in to<br />
        <strong className="text-dark">Anjaraipetti</strong>
      </p>
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-green animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}


// ── Main Modal ────────────────────────────────────────────────────────────────
export default function LoginModal() {
  const {
    loginOpen, closeLogin,
    loginStep, setLoginStep,
    loginData, setLoginData,
    login,
  } = useAuth()

  const handleNamePhoneNext = ({ name, phone }) => {
    setLoginData({ name, phone })
    setLoginStep(2)
  }

  const handleOtpSuccess = (user, token) => {
    login(user, token)
    setLoginStep(3)
  }

  if (!loginOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[998] backdrop-blur-sm"
        onClick={loginStep !== 3 ? closeLogin : undefined}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:px-4"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,.18)] w-full max-w-[400px] px-6 sm:px-9 py-8 sm:py-9 relative mt-auto sm:mt-0 max-h-[90vh] overflow-y-auto">

          {/* Close button */}
          {loginStep !== 3 && (
            <button
              onClick={closeLogin}
              className="absolute top-4 right-5 text-2xl text-mid hover:text-dark
                         transition-colors leading-none"
            >
              ×
            </button>
          )}

          {/* Step indicator dots */}
          {loginStep !== 3 && (
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300
                    ${loginStep >= s ? 'bg-green w-8' : 'bg-green-pale w-4'}`}
                />
              ))}
            </div>
          )}

          {loginStep === 1 && (
            <StepNamePhone
              onNext={handleNamePhoneNext}
              defaultData={loginData}
            />
          )}

          {loginStep === 2 && (
            <StepOtp
              phone={loginData.phone}
              name={loginData.name}
              onSuccess={handleOtpSuccess}
              onBack={() => setLoginStep(1)}
            />
          )}

          {loginStep === 3 && (
            <StepWelcome
              name={loginData.name || loginData.phone}
              onClose={closeLogin}
            />
          )}

          {loginStep !== 3 && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[11px] text-mid">
                <i className="fa-solid fa-lock mr-1"></i> Secure login · No password needed · FSSAI Certified Brand
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
