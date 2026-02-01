import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserPermision } from '@/app/permission/utils/getUserPermission'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('upload', 'Game')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF' },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 },
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `games/${timestamp}-${sanitizedName}`

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      url,
      filename: file.name,
    })
  } catch (error) {
    console.error('[v0] Erro ao fazer upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload do arquivo' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 })
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Erro ao deletar arquivo:', error)
    return NextResponse.json({ error: 'Erro ao deletar arquivo' }, { status: 500 })
  }
}
