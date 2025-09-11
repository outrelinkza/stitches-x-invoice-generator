import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackEmail, FeedbackData } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, feedback, rating } = body;

    // Validate required fields
    if (!name || !email || !feedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const feedbackData: FeedbackData = {
      name: name.trim(),
      email: email.trim(),
      feedback: feedback.trim(),
      rating: rating ? parseInt(rating) : undefined,
    };

    // Send email
    const success = await sendFeedbackEmail(feedbackData);

    if (success) {
      return NextResponse.json(
        { message: 'Feedback submitted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send feedback email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Feedback form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
