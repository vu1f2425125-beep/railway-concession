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
  year: String,
  division: String,
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      student: {
        email: student.email,
        name: student.name,
        fullName: student.name,
        rollNumber: student.rollNumber,
        course: student.course,
        year: student.year,
        division: student.division,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}