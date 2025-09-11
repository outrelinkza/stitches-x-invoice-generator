import { NextRequest, NextResponse } from 'next/server';
import { sendInvoiceEmail, InvoiceEmailData } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clientEmail, 
      clientName, 
      invoiceNumber, 
      total, 
      pdfData, 
      companyName 
    } = body;

    // Validate required fields
    if (!clientEmail || !clientName || !invoiceNumber || !total || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate total amount
    const totalAmount = parseFloat(total);
    if (isNaN(totalAmount) || totalAmount < 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    const invoiceData: InvoiceEmailData = {
      clientEmail: clientEmail.trim(),
      clientName: clientName.trim(),
      invoiceNumber: invoiceNumber.trim(),
      total: totalAmount,
      pdfBuffer: pdfData ? Buffer.from(pdfData, 'base64') : undefined,
      companyName: companyName.trim(),
    };

    // Send email
    const success = await sendInvoiceEmail(invoiceData);

    if (success) {
      return NextResponse.json(
        { message: 'Invoice sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send invoice email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Invoice email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
