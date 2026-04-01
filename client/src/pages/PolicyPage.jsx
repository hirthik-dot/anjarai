import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    content: `Privacy Policy
• When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us, such as your name, address, and email address. When you browse our store, we also automatically receive your computer’s Internet Protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
• We will NOT share the email and contact information with anybody. We will not spam.
• We will occasionally send flyers and special promotions from Anjaraipetti Pickles. and our own other businesses.
• Email Marketing (if applicable): With your Permission, we may send you emails about our store, new product updates, promotions, and other updates. (We will send you the email updates of the new products/Services of our store.
• We will remind you the Important Occassions, Festivals,Seasonal Rituals like Karthika Maasam etc., and Special Days/Utsavams at Famous Sacred Temples periodically).

Please mark "Not Spam" on your mail to get regular updates.

How do you get my consent?
When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery, or return a purchase, we imply that you have given your consent to us to collect and use it for that specific reason only.
If we ask for your personal information for a secondary purpose, such as marketing, we will either ask you directly for your express consent or provide you with an opportunity to decline.

How do I withdraw my consent?
If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at any time, by contacting us at anjaraipettifoods@gmail.com`
  },
  refund: {
    title: 'Cancellation, Return and Refund Policy',
    content: `Refund & Return Policy
Please review the information below
Effective Date: 01st May 2026

Thank you for shopping with Anjaraipetti Foods. We take pride in delivering freshly prepared, hygienic, and high-quality homemade food products to our customers. As our products are perishable, we follow a strict no-return and no-exchange policy. However, refunds may be considered under specific circumstances as described below.

1. Return Policy
We do not accept returns once the product has been delivered. Due to food safety and hygiene standards, returned food items cannot be resold or reused. Products are considered non-returnable and non-refundable under normal conditions, such as change of mind, taste or personal preference, incorrect address provided by the customer, or delay caused due to the recipient's unavailability.

2. Refund Eligibility
Refunds will be considered only if the customer does not receive the product within 6–8 business days after dispatch confirmation. In such cases, the customer must contact us within 2 days after the delivery deadline has passed. The claim will be verified with our shipping partner before approval.

3. Refund Request Process
If your order qualifies for a refund, contact us via email at anjaraipettifoods@gmail.com or through WhatsApp. Provide your Order ID and relevant order details. Additional verification from courier records may be required before refund initiation.

4. Refund Method
Approved refunds will be processed to the original payment method used during purchase. Refund initiation will take 3–4 working days after approval; the credited amount may take additional time depending on your bank or payment provider.

5. Non-Refundable Conditions
Refunds will not be issued if the product is successfully delivered to the provided address, the customer provided an incorrect or incomplete delivery address, the customer fails to contact us within 2 days after the delivery deadline, or the refund request is based on taste, preference, or change of mind.

6. Replacements
We currently do not offer replacements for any products.

7. Contact Us
For refund-related queries or assistance, contact:
📧 anjaraipettifoods@gmail.com
📞 Chat on WhatsApp
🌐 www.anjaraipettifoods.com`
  },
  shipping: {
    title: 'Shipping Policy',
    content: `Shipping Policy
🚚Shipping Policy – Anjaraipetti Foods

1. Product Availability
• All orders are processed subject to stock availability.
• If any item you ordered is out of stock, we will notify you right away and issue a full refund using your original payment method.

2. Delivery Locations
• Across India: We deliver to all states.

3. Delivery Timelines (from dispatch date, not order date)
• Within Tamil Nadu: 1–3 business days
• Other states in India: 1–5 business days
Please note:
• These are estimated timelines. We cannot guarantee same-day, next-day, or 2-day delivery.
• Delays may occur due to incorrect address details, courier issues, weather conditions, strikes, or other external factors.

4. Order Dispatch Schedule
• Monday to Saturday: Orders placed before 10:00 AM are usually shipped the same evening.
• After Saturday 11:00 AM: Some orders are shipped starting Monday evening.
• No Sunday dispatches (courier services do not operate).

5. Shipping Partners
• Tamil Nadu deliveries: The Professional Courier & ST Courier
• Rest Of Tamil Nadu States: BlueDart & DTDC
If you’d like us to use a different courier service:
• Mention it in the order notes at checkout or inform us immediately after placing the order.
• Extra charges may apply if you choose a specific courier.

6. Shipping Charges
• Shipping cost is calculated at checkout based on:
             Your delivery location
             The total order value (after applying product discounts)
• Coupons apply only to product prices, not to shipping fees.
• Only one coupon code can be used per order.

7. Damaged Deliveries
• If your package looks damaged upon arrival, contact us immediately at info@anjaraipettifoods.com.
• Do not accept visibly tampered or broken packages without informing us.

8. Important Delivery Notes
We are not responsible for delivery failures caused by:
• Incomplete or incorrect address or phone number
• No one is available to receive the order at the delivery address
In such cases:
• No refunds will be issued.
• Returns and cancellations are not accepted once an order is shipped.
Please double-check:
• Your shipping address and contact number
• That someone is available to receive the delivery at the provided address

9. Need Help?
If you have any questions about your delivery or shipping, feel free to reach out:
📧 info@anjaraipettifoods.com – We’re always happy to assist!`
  },
  terms: {
    title: 'Terms & Conditions',
    content: `Terms & Conditions
Please review the information below
Effective Date: 01st  May  2026

Welcome to Anjaraipetti Foods. By accessing or purchasing from our website, www.anjaraipettifoods.com, you agree to abide by the following Terms & Conditions. Please read them carefully before placing an order.

If you have any questions, feel free to contact us at:
• 📧 anjaraipettifoods@gmail.com
• 📞 Chat on WhatsApp

1. Business Details
Business Name: Anjaraipetti Foods
Website: www.anjaraipettifoods.com
FSSAI License Number: 
Nature of Business: Manufacturing and selling of homemade food products including spice powders, pickles, snacks, sweets, and related food items.

2. Eligibility to Purchase
There are no age restrictions to purchase products from our website. However, users are expected to provide accurate and complete information while placing orders.

3. Pricing Policy
All prices displayed are in Indian Rupees (INR). Prices are subject to change at any time based on market conditions and raw material costs without prior notice. Currently, no discounts, promotions, or coupon codes are applicable unless explicitly mentioned.

4. Order Policy
Once an order is placed and confirmed, it cannot be cancelled or modified. Due to the perishable nature of our products, returns or exchanges are not accepted. Customers must verify product details, address, and contact information before confirming the order.

5. Payment Policy
Payments are securely processed through Razorpay. Accepted payment methods include UPI, Net Banking, Credit/Debit Cards, and Wallets. We do not store any payment details on our servers.

6. Shipping Policy
We offer delivery across India and international shipping to selected countries. Estimated delivery timelines: Within India: 3–8 business days. International: Depends on destination and customs clearance. Tracking details will be shared once the order is dispatched.

7. Product Handling & Delivery
All products are hygienically prepared and securely packed before dispatch. After handing over the shipment to the courier partner, Anjaraipetti Foods is not responsible for transit damage, delays, or customs-related issues.

8. Refund & Replacement Policy
Refunds or replacements are not applicable for change of mind, incorrect delivery address provided by the customer, courier or customs delays. In case of wrong or damaged items, customers must contact us within 24 hours of delivery with clear photo or video proof for evaluation.

9. Changes to Terms & Conditions
Anjaraipetti Foods reserves the right to modify these Terms & Conditions at any time. Updates will be posted on this page, and continued use of the website indicates acceptance of the revised terms.

10. Governing Law & Jurisdiction
These Terms & Conditions are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Tamilnadu, India.

11. Contact Us
For any questions or assistance, contact:
📧 anjaraipettifoodsgmail.com
📞 Chat on WhatsApp
🌐 www.anjaraipettifoods.com`
  }
};

export default function PolicyPage({ policyKey }) {
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate slight loading to ensure smooth transition
    const t = setTimeout(() => {
      setData(POLICIES[policyKey] || { title: 'Not Found', content: 'Policy could not be found.' });
      setLoading(false);
    }, 100);
    return () => clearTimeout(t);
  }, [policyKey]);

  if (loading) {
    return (
      <div className="flex-grow min-h-[40vh] flex items-center justify-center text-green font-black uppercase tracking-[0.3em] text-xs animate-pulse">
        {t('Loading...')}
      </div>
    );
  }

  if (!data || data.title === 'Not Found') {
    return (
      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-red-500 font-bold mb-6">Policy could not be loaded.</p>
        <Link to="/" className="text-green font-black uppercase tracking-widest text-xs">
          {t('Back to Home') || 'Back to Home'} →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-green mb-6">
        ← {t('Home')}
      </Link>

      <h1 className="font-head text-2xl sm:text-3xl font-black text-dark mb-5 tracking-tight">
        {data.title}
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
        <pre className="text-[13px] sm:text-[14.5px] leading-[1.8] font-sans text-gray-700 whitespace-pre-wrap format-policy-text">
          {data.content}
        </pre>
      </div>
    </div>
  );
}
