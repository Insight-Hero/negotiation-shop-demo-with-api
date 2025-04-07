# Negotiation Demo Shop
This is a Next.js application demonstrating a negotiation system for e-commerce shop. Users can select product variants, submit offers, and receive responses (accepted, rejected, special offers) via Insight Hero API. The app uses local storage to track offers and discounts, with a "Buy Now" option appearing when an offer is accepted or a special discount is available.

## Getting Started

1. Clone the Repository

```bash
git clone <repository-url>
cd negotiation-shop-demo-with-api
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```text
NEXT_PUBLIC_API_URL=<Insight-Hero-API-Url>
NEXT_PUBLIC_API_KEY=<your-api-key>
```

- `NEXT_PUBLIC_API_URL`: The base URL for Insight Hero API.
- `NEXT_PUBLIC_API_KEY`: Your API key for authentication, provided by Insight Hero API service.
Note: Replace `<your-api-key>` with the actual key. These variables are used in the API calls.

4. Run the Development Server
```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Navigate to `/products/<productId>` to test a product page.



## Key Implementation: Offer API Call
The implementation of the offer API call is located in **`src/components/NegotiationForm.tsx`**. This is the core of the negotiation feature:

- Location: `handleSubmit` function in `NegotiationForm.tsx`.

- **What it Does**:
    - Sends a `POST` request to `${NEXT_PUBLIC_API_URL}/api/bids` with `productId`, `variantId`, and `bid`.
    - Uses the `Authorization: Bearer ${NEXT_PUBLIC_API_KEY}` header for authentication.
    - Handles responses (accepted, rejected, special offer, previous offer) and updates the UI.

- **Example Request**:
```javascript
fetch("<apiUrl>/api/bids", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify({
    productId: 6965953462307,
    variantId: 40370960334883,
    bid: 700,
  }),
});
```

- **Response Handling**: Check the `handleSubmit` function for how `data.value`, `data.isSpecialOffer`, etc., are processed.
- **Frontend Developers**: Study `NegotiationForm.tsx` to understand the API integration, local storage usage, and state management for the negotiation flow.

### API Details
- Endpoint: `POST /api/bids`
- Docs: https://pmp-api-docs.insight-hero.ai/bids/

### Local Storage
- Discounts: Stored as discounts_<productId> (e.g., discounts_6965953462307).
    - Format: Array of { productId, target, discountCode, discount, timestamp }.
    - Expires after 24 hours.
- Usage: Checked on load to show "Buy Now" if a valid discount exists for the variant.

### Troubleshooting
- **API Errors**: Ensure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY` are set correctly in `.env.local`.
- **Product Not Found**: Verify `productId` in the URL matches `data.ts`.
- **Console Logs**: Check `console.log(data)` in `NegotiationForm.tsx` for API response debugging.

## Example Products CSV File
- **Location**: `/csv/sample_products.csv`
- **Purpose**: A reference file showing the format for importing products into the API database.
- **Documentation**: https://pmp-api-docs.insight-hero.ai/productsimport/
- **Usage**:
    - Review `sample_products.csv` for the required columns (e.g., `productId`, `name`, `variantId`, `price`).
    - Use this format to create your own CSV and import products to the API database as per the documentation.
- **Developers**: Check `/csv/sample_products.csv` for a practical example before importing products.