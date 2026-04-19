import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()
    const db = mongoose.connection.db
    const notice = await db!.collection('settings').findOne({ type: 'authorityNotice' })
    return NextResponse.json({ success: true, notice: notice || null })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch notice' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const db = mongoose.connection.db
    await db!.collection('settings').updateOne(
      { type: 'authorityNotice' },
      { $set: { ...body, type: 'authorityNotice' } },
      { upsert: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save notice' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await connectDB()
    const db = mongoose.connection.db
    await db!.collection('settings').deleteOne({ type: 'authorityNotice' })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete notice' }, { status: 500 })
  }
}