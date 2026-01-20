# Stripe Test Card Information

Use these test card numbers when testing payments in **development/test mode**:

## ✅ Successful Payment Test Cards

### Visa (Most Common)
- **Card Number:** `4242 4242 4242 4242`
- **Expiry Date:** Any future date (e.g., `12/34` or `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### Visa (Debit)
- **Card Number:** `4000 0566 5566 5556`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits

### Mastercard
- **Card Number:** `5555 5555 5555 4444`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits

### American Express
- **Card Number:** `3782 822463 10005`
- **Expiry Date:** Any future date
- **CVC:** Any 4 digits (AMEX uses 4 digits)

## ❌ Test Cards for Error Scenarios

### Declined Card
- **Card Number:** `4000 0000 0000 0002`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **Result:** Card declined

### Insufficient Funds
- **Card Number:** `4000 0000 0000 9995`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **Result:** Insufficient funds error

### Card Expired
- **Card Number:** `4000 0000 0000 0069`
- **Expiry Date:** Any past date
- **CVC:** Any 3 digits
- **Result:** Expired card error

### Processing Error
- **Card Number:** `4000 0000 0000 0119`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **Result:** Processing error

## 🧪 3D Secure Test Cards

### 3D Secure Authentication Required
- **Card Number:** `4000 0027 6000 3184`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **Result:** Requires 3D Secure authentication (you'll need to complete authentication)

### 3D Secure Authentication Failed
- **Card Number:** `4000 0082 6000 3178`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **Result:** 3D Secure authentication fails

## 📝 Important Notes

1. **Only works in Test Mode:** These cards only work when using Stripe test API keys (keys starting with `pk_test_` and `sk_test_`)

2. **Any Future Date:** For expiry date, use any date in the future. Common examples:
   - `12/34` (December 2034)
   - `01/25` (January 2025)
   - `12/99` (December 2099)

3. **Any CVC:** For CVC/CVV, use any valid number:
   - Visa/Mastercard: Any 3 digits (e.g., `123`, `456`, `789`)
   - American Express: Any 4 digits (e.g., `1234`, `5678`)

4. **Name/Billing Address:** Can be any fake information for testing:
   - Name: `Test User`
   - Address: `123 Test St`
   - ZIP: `12345`

## 🔗 Official Documentation

For more test cards and scenarios, visit:
- https://docs.stripe.com/testing
