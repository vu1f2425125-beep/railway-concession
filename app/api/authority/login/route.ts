import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AuthoritySchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
});

const Authority = mongoose.models.Authority || mongoose.model('Authority', AuthoritySchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const authority = await Authority.findOne({ email });
    if (!authority) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const isValid = await bcrypt.compare(password, authority.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    return NextResponse.json({ success: true, authority: { email: authority.email, name: authority.name } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}