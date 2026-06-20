import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data } = await req.json()
    if (!data) return NextResponse.json({ error: 'No image data' }, { status: 400 })

    const result = await cloudinary.uploader.upload(data, {
      folder: 'banobagiNepal',
      resource_type: 'auto',
    })

    if (!result.url) {
      throw new Error('Upload failed')
    }

    return NextResponse.json({ url: result.secure_url || result.url })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
