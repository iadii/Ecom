import { useState } from 'react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const requestOtp = (e) => {
    e.preventDefault()
    alert(`OTP sent to ${phone}`)
  }

  const loginEmail = (e) => {
    e.preventDefault()
    alert(`Login link sent to ${email}`)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-[#222222] mb-6">Login</h1>

      <form onSubmit={requestOtp} className="bg-[#F5F5F7] p-4 rounded-md mb-6">
        <label className="block text-sm text-[#555555] mb-2">Phone Number</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" className="w-full px-3 py-2 rounded-md border border-[#E5E7EB]" />
        <button className="mt-3 w-full px-4 py-2 rounded-md text-white" style={{ backgroundColor: '#6C1D57' }}>Request OTP</button>
      </form>

      <div className="text-center text-[#555555] mb-4">or</div>

      <form onSubmit={loginEmail} className="bg-[#F5F5F7] p-4 rounded-md">
        <label className="block text-sm text-[#555555] mb-2">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" className="w-full px-3 py-2 rounded-md border border-[#E5E7EB]" />
        <button className="mt-3 w-full px-4 py-2 rounded-md text-white" style={{ backgroundColor: '#6C1D57' }}>Sign in with Email</button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button className="px-4 py-2 rounded-md border">Facebook</button>
        <button className="px-4 py-2 rounded-md border">Google</button>
        <button className="px-4 py-2 rounded-md border">Apple</button>
      </div>
    </div>
  )
}