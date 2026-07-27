// Settings profile + About content — ported from owner-responsive.html.
export const OWNER_PROFILE = {
  name: 'Ahmed Raza',
  email: 'ahmed@alfatah.pk',
  phone: '0321-4567890',
  initials: 'AR',
  plan: 'Pro Plan',
  business: 'Al Fatah Superstore',
}

export const TOS_CONTENT = {
  title: 'Terms of Service',
  subtitle: 'Last updated: July 1, 2026',
  icon: 'document-text-outline',
  iconWrap: 'bg-navy/10 text-navy',
  intro: { icon: 'information-circle-outline', color: 'text-navy', bg: 'bg-navy/5 border-navy/10', text: 'By using RetailOS, you agree to these Terms. Please read them carefully.' },
  sections: [
    { heading: '1. Acceptance of Terms', body: ['By accessing or using the RetailOS platform ("Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our Service.'] },
    { heading: '2. Use of the Service', body: ['You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:'], list: ['Use the Service in any way that violates applicable laws or regulations.', 'Attempt to gain unauthorised access to any part of the Service.', 'Transmit any unsolicited or unauthorised advertising material.', 'Impersonate any person or entity or misrepresent your affiliation.', 'Interfere with or disrupt the integrity or performance of the Service.'] },
    { heading: '3. Accounts & Subscriptions', body: ['You are responsible for maintaining the confidentiality of your account credentials. Subscription fees are charged according to your selected plan. Failure to renew your subscription within the grace period will result in account suspension until a verified payment is received.'] },
    { heading: '4. Intellectual Property', body: ['The Service and its original content, features, and functionality are and will remain the exclusive property of RetailOS Pvt. Ltd. Our trademarks may not be used without the prior written consent of the company.'] },
    { heading: '5. Limitation of Liability', body: ['RetailOS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the Service. Our total liability shall not exceed the amount paid by you for the Service in the twelve months preceding the claim.'] },
    { heading: '6. Termination', body: ['We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.'] },
    { heading: '7. Governing Law', body: ['These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of courts in Lahore, Pakistan.'] },
    { heading: '8. Changes to Terms', body: ['We reserve the right to modify these Terms at any time. We will notify you of significant changes via email or an in-app notice. Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.'] },
  ],
  footer: 'For questions about these Terms, contact us at legal@retailos.pk',
}

export const PRIVACY_CONTENT = {
  title: 'Privacy Policy',
  subtitle: 'Last updated: July 1, 2026',
  icon: 'shield-checkmark-outline',
  iconWrap: 'bg-brand-blue/10 text-brand-blue',
  intro: { icon: 'shield-checkmark-outline', color: 'text-brand-blue', bg: 'bg-brand-blue/5 border-brand-blue/15', text: 'Your privacy matters to us. This policy explains how we collect, use, and protect your data.' },
  sections: [
    { heading: '1. Information We Collect', body: ['We collect information you provide directly when you register or use the Service, including:'], list: ['Business and owner details (name, email, phone, address)', 'Transaction and sales data generated through your stores', 'Staff and customer information you enter into the platform', 'Usage data, log files, and device/browser information'] },
    { heading: '2. How We Use Your Information', list: ['To provide, operate, and maintain the RetailOS Service', 'To process subscription payments and send billing notices', 'To send operational and account-related communications', 'To monitor usage patterns and improve platform performance', 'To comply with legal obligations and enforce our Terms'] },
    { heading: '3. Data Sharing', body: ['We do not sell your personal data to third parties. We may share data with trusted service providers who assist us in operating the platform, subject to confidentiality agreements. We may disclose information where required by law or to protect our rights.'] },
    { heading: '4. Data Retention', body: ['We retain your data for as long as your account is active, or as required by law. You may request deletion of your account and associated data by contacting our support team. Some information may be retained for legal and fraud-prevention purposes.'] },
    { heading: '5. Security', body: ['We implement industry-standard security measures including encryption in transit (TLS), encrypted storage for sensitive data, and access controls. However, no method of transmission over the internet is 100% secure.'] },
    { heading: '6. Your Rights', body: ['You have the right to:'], list: ['Access the personal data we hold about you', 'Request correction of inaccurate data', 'Request deletion of your data (subject to legal requirements)', 'Object to or restrict certain types of processing'] },
    { heading: '7. Cookies', body: ['We use cookies and similar tracking technologies to maintain session state and improve your experience. You can control cookie settings through your browser preferences.'] },
  ],
  footer: 'For privacy enquiries, contact privacy@retailos.pk',
}

export const REFUND_CONTENT = {
  title: 'Refund Policy',
  subtitle: 'Last updated: July 1, 2026',
  icon: 'return-up-back-outline',
  iconWrap: 'bg-brand-orange/10 text-brand-orange',
  intro: { icon: 'alert-circle-outline', color: 'text-brand-orange', bg: 'bg-brand-orange/5 border-brand-orange/20', text: 'All payments are processed as bank transfers and verified manually. Please read our refund policy carefully before submitting a payment.' },
  sections: [
    { heading: '1. Payment Method', body: ['RetailOS collects subscription fees via bank transfer only. Payments are manually verified by our admin team within 1–2 business days. Your subscription is activated upon successful verification.'] },
    { heading: '2. Eligibility for Refunds', body: ['Refunds may be considered under the following circumstances:'], list: ['Duplicate payment — if you accidentally submitted two payments for the same billing cycle.', 'Overpayment — if the transferred amount exceeds the plan price, the excess will be credited to your next cycle or refunded.', 'Service unavailability — if the platform was unavailable for more than 72 consecutive hours due to our fault during a paid period.'] },
    { heading: '3. Non-Refundable Situations', list: ['Early cancellation of an active subscription cycle', 'Account suspension due to Terms of Service violations', 'Payments for months already consumed', 'Change of mind after a subscription plan has been activated', "Rejected payments where the error was on the submitter's side (wrong reference, wrong amount)"] },
    { heading: '4. Refund Process', body: ['To request a refund:'], ordered: ['Email billing@retailos.pk with your business name, payment reference number, and reason for the refund request.', 'Our billing team will review the request within 3 business days.', 'Approved refunds are transferred back to your original bank account within 5–7 business days.'] },
    { heading: '5. Plan Changes', body: ['Switching to a lower plan does not entitle you to a refund for the remaining days on your current plan. The new plan takes effect from the next billing cycle after the plan-change payment is verified.'] },
    { heading: '6. Contact', body: ['For all billing and refund queries, reach us at billing@retailos.pk or call 042-111-RETAIL (Mon–Sat, 9 AM – 6 PM).'] },
  ],
  footer: 'Need help? Contact our billing team at billing@retailos.pk',
}
