const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jp704874@gmail.com', // Replace with your Gmail
    pass: 'your-app-password' // Replace with Gmail App Password
  }
});

// Place COD Order (Send Emails)
exports.placeCodOrder = functions.https.onCall(async (data, context) => {
  try {
    const orderData = data;

    // Email to user (receipt)
    const userMailOptions = {
      from: 'your-email@gmail.com',
      to: orderData.userEmail,
      subject: 'Praso Clothing - COD Order Confirmation',
      html: generateReceiptHtml(orderData, 'Thank you for your order!')
    };

    // Email to you (notification)
    const adminMailOptions = {
      from: 'your-email@gmail.com',
      to: 'jp704874@gmail.com',
      subject: 'New COD Order - Praso Clothing',
      html: generateReceiptHtml(orderData, 'A new COD order has been placed.')
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    return { success: true };
  } catch (err) {
    throw new functions.https.HttpsError('internal', 'Failed to send email: ' + err.message);
  }
});

// Generate Email Receipt HTML
function generateReceiptHtml(orderData, greeting) {
  const { cart, appliedCoupon, deliveryDetails, paymentId, orderId, paymentMethod, userEmail } = orderData;
  const usdToInr = 80;
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * usdToInr;
  let discount = 0;
  const coupons = { 'SAVE10': 0.10, 'SAVE20': 0.20, 'FLAT50': 50 };

  if (appliedCoupon && coupons[appliedCoupon]) {
    discount = appliedCoupon === 'FLAT50' ? coupons[appliedCoupon] * usdToInr : total * coupons[appliedCoupon];
    total = Math.max(0, total - discount);
  }

  return `
    <h2>Praso Clothing - Order Confirmation</h2>
    <p>${greeting}</p>
    <p><strong>User Email:</strong> ${userEmail}</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Payment ID:</strong> ${paymentId}</p>
    <p><strong>Payment Method:</strong> Cash on Delivery</p>
    <h3>Order Details</h3>
    ${cart.map(item => `
      <p>${item.name} (Size: ${item.size}, Quantity: ${item.quantity}) - ₹${Math.round(item.price * item.quantity * usdToInr).toLocaleString('en-IN')}</p>
    `).join('')}
    <p><strong>Subtotal:</strong> ₹${Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * usdToInr).toLocaleString('en-IN')}</p>
    ${appliedCoupon ? `<p><strong>Discount (${appliedCoupon}):</strong> -₹${Math.round(discount).toLocaleString('en-IN')}</p>` : ''}
    <p><strong>Total:</strong> ₹${Math.round(total).toLocaleString('en-IN')}</p>
    <h3>Delivery Details</h3>
    <p><strong>Name:</strong> ${deliveryDetails.firstName} ${deliveryDetails.lastName}</p>
    <p><strong>Address:</strong> ${deliveryDetails.address}, ${deliveryDetails.apartment || ''}</p>
    <p><strong>City:</strong> ${deliveryDetails.city}, ${deliveryDetails.state} ${deliveryDetails.pincode}</p>
    <p><strong>Phone:</strong> ${deliveryDetails.phone}</p>
    <p><strong>Save Info:</strong> ${deliveryDetails.saveInfo ? 'Yes' : 'No'}</p>
    <p>Thank you for shopping with Praso Clothing!</p>
  `;
}