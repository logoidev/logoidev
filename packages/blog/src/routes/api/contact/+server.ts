import { json } from '@sveltejs/kit';
import { SECRET_RESEND_API_KEY } from '$env/static/private';
import { INTRO_EMAIL } from 'src/data/emails';

export const prerender = false;

interface ContactRequest {
	email: string;
	title: string;
	message: string;
}

export async function POST({ request }: { request: Request }) {
	try {
		const body: ContactRequest = await request.json();
		const { email, title, message } = body;

		// Validate required fields
		if (!email || !title || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Send email using Resend
		if (!SECRET_RESEND_API_KEY) {
			console.error('SECRET_RESEND_API_KEY is not configured');
			return json({ error: 'Email service not configured' }, { status: 500 });
		}

		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SECRET_RESEND_API_KEY}`
			},
			body: JSON.stringify({
				from: 'Contact Form <contact@logoi.dev>',
				to: [INTRO_EMAIL],
				reply_to: email,
				subject: `Contact Form: ${title}`,
				html: `
					<h2>New Contact Form Submission</h2>
					<p><strong>From:</strong> ${email}</p>
					<p><strong>Subject:</strong> ${title}</p>
					<hr>
					<p><strong>Message:</strong></p>
					<p>${message.replace(/\n/g, '<br>')}</p>
				`
			})
		});

		if (!resendResponse.ok) {
			const errorData = await resendResponse.json().catch(() => ({}));
			console.error('Resend API error:', errorData);
			return json({ error: 'Failed to send email' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error processing contact form:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
