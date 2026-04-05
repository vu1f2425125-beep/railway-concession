import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const StudentSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  rollNumber: String,
  course: String,
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password, name, rollNumber, course } = await req.json();
    const existing = await Student.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Student already exists' }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const student = await Student.create({ email, password: hash, name, rollNumber, course });
    return NextResponse.json({ success: true, student });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}