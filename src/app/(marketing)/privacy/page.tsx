import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 2023</p>
      
      <h2>1. Information We Collect</h2>
      <p>When you use SIGNAL, we collect information that you provide to us directly, such as your email and name when you create an account. When you connect social accounts, we access data via their official APIs (like Meta Graph API) to provide you with analytics.</p>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use your information solely to provide, maintain, and improve the SIGNAL service. We do not sell your data to third parties. AI features process your content data to generate insights, but this data is not used to train global models.</p>
      
      <h2>3. Data Security</h2>
      <p>We implement industry-standard security measures to protect your data. Your passwords are encrypted, and OAuth tokens are stored securely. "Your password is NEVER shared with SIGNAL" when connecting social accounts.</p>
    </div>
  );
}