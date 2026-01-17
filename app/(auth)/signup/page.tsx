'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export default function SignupPage() {
  async function handleCreate() {
    await authClient.signUp.email({
      email: 'dev@dev.com',
      password: 'admin123',
      name: 'Dev Admin',
    })
  }

  return (
    <div>
      Signup Page
      <Button onClick={handleCreate}>Create</Button>
    </div>
  )
}
