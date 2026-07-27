import { useState } from 'react'
import AuthShell from './AuthShell'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import OtpVerification from './OtpVerification'
import ResetPassword from './ResetPassword'

// Orchestrates the auth screens: login → forgot → otp → reset. On successful
// login it calls onAuthenticated() to hand control to the admin app.
export default function AuthFlow({ onAuthenticated }) {
  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')

  return (
    <AuthShell>
      {view === 'login' && <Login onForgot={() => setView('forgot')} onAuthenticated={onAuthenticated} />}

      {view === 'forgot' && (
        <ForgotPassword
          initialEmail={email}
          onBack={() => setView('login')}
          onCodeSent={(e) => {
            setEmail(e)
            setView('otp')
          }}
        />
      )}

      {view === 'otp' && (
        <OtpVerification email={email} onBack={() => setView('forgot')} onVerified={() => setView('reset')} />
      )}

      {view === 'reset' && <ResetPassword onDone={() => setView('login')} onBack={() => setView('login')} />}
    </AuthShell>
  )
}
