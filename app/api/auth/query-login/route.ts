import { createClient } from '@supabase/supabase-js';
import { verifyPassword, generateSessionToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Query-based login endpoint
 * 
 * Usage:
 * GET /api/auth/query-login?id=username&pass=password&service=training
 * 
 * Query Parameters:
 * - id: username or email
 * - pass: password
 * - service: (optional) service to use (training, printing, pc_use)
 * - redirect: (optional) URL to redirect after login
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const pass = searchParams.get('pass');
    const service = searchParams.get('service');
    const redirectUrl = searchParams.get('redirect');

    // Validate required parameters
    if (!id || !pass) {
      return NextResponse.json(
        { error: 'Missing required query parameters: id and pass' },
        { status: 400 }
      );
    }

    // Find user by email or username (full_name)
    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', id)
      .single();
    
    let user = userByEmail;

    // If not found, try full_name
    if (!user) {
      const { data: userByName } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', id)
        .single();
      user = userByName;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(pass, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create login session
    const { data: session, error: sessionError } = await supabase
      .from('login_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        service_used: service || null,
        login_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Set secure cookie with session token
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Determine redirect URL
    let finalRedirectUrl = '/dashboard';
    if (service) {
      finalRedirectUrl = `/dashboard?service=${service}&userId=${user.id}`;
    }
    if (redirectUrl) {
      finalRedirectUrl = decodeURIComponent(redirectUrl);
    }

    // Return response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        session: {
          token: sessionToken,
          user_id: user.id,
          service_used: service || null,
          redirect: finalRedirectUrl,
        },
      },
      { status: 200 }
    );

    // Optionally redirect if requested
    if (searchParams.get('redirect_mode') === 'true') {
      return NextResponse.redirect(new URL(finalRedirectUrl, request.url));
    }

    return response;
  } catch (error) {
    console.error('Query login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Also support POST for better security
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const body = await request.json();
    const { id, pass, service, redirect } = body;

    // Validate required fields
    if (!id || !pass) {
      return NextResponse.json(
        { error: 'Missing required fields: id and pass' },
        { status: 400 }
      );
    }

    // Find user by email or username
    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', id)
      .single();

    let user = userByEmail;
    
    if (!user) {
      const { data: userByName } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', id)
        .single();
      user = userByName;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(pass, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create login session
    const { data: session, error: sessionError } = await supabase
      .from('login_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        service_used: service || null,
        login_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Determine redirect URL
    let finalRedirectUrl = '/dashboard';
    if (service) {
      finalRedirectUrl = `/dashboard?service=${service}&userId=${user.id}`;
    }
    if (redirect) {
      finalRedirectUrl = redirect;
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        session: {
          token: sessionToken,
          user_id: user.id,
          service_used: service || null,
          redirect: finalRedirectUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Query login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
