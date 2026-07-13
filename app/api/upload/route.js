import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await req.json()
    if (!data) return NextResponse.json({ error: 'No image data' }, { status: 400 })

    // Validate MIME type from base64 data URI
    const mimeMatch = data.match(/^data:([^;]+);base64,/)
    if (!mimeMatch || !ALLOWED_MIME_TYPES.includes(mimeMatch[1])) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 })
    }

    // Validate size
    const base64Data = data.split(',')[1] || ''
    const sizeBytes = Math.ceil((base64Data.length * 3) / 4)
    if (sizeBytes > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 })
    }

    const result = await cloudinary.uploader.upload(data, {
      folder: 'banobagiNepal',
      resource_type: 'image',
    })

    if (!result.url) throw new Error('Upload failed')

    return NextResponse.json({ url: result.secure_url || result.url })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
