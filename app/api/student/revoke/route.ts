import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  id: String,
  studentEmail: String,
  status: String,
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Application.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}