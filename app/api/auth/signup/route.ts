import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await request.json();

    const {
      full_name,
      email,
      password,
      gender,
      age_group,
      sector,
      agency,
      is_senior_citizen,
      is_abled,
      nationality,
      region,
      is_solo_parent,
      civil_status,
      office_affiliation,
      designation,
      address,
      phone_number,
      birthdate,
    } = body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate username from full_name (remove spaces and make lowercase)
    const baseUsername = full_name
      .toLowerCase()
      .replace(/\s+/g, '')
      .substring(0, 50);

    // Ensure unique username by adding a random suffix if needed
    let username = baseUsername;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (!existingUsername) {
        isUnique = true;
      } else {
        username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
        attempts++;
      }
    }

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        full_name,
        email,
        password_hash: hashedPassword,
        gender,
        age_group,
        sector,
        agency,
        is_senior_citizen,
        is_abled,
        nationality,
        region,
        is_solo_parent,
        civil_status,
        office_affiliation,
        designation,
        address,
        phone_number,
        birthdate,
      })
      .select()
      .single();

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
