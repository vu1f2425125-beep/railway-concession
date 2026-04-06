import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  id: String,
  studentEmail: String,
  studentName: String,
  rollNumber: String,
  course: String,
  year: String,
  division: String,
  fromStation: String,
  toStation: String,
  duration: String,
  startDate: String,
  endDate: String,
  status: { type: String, default: 'Pending' },
  offlineFormCollectionDateTime: String,
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const applications = await Application.find({ studentEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}