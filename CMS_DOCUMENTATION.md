# Lens&Look CMS Documentation

Welcome to your lightweight CMS. This dashboard allows you to manage products, inventory, and track orders seamlessly.

## Admin Access
- **URL**: `/admin/login`
- **Authentication**: Enter your Master Key (configured in environment variables as `ADMIN_PASSWORD`).

## Dashboard
The **Command Center** gives you a holistic view of:
- Total Revenue
- Inventory Health (Low stock alerts)
- Recent Acquisitions (New orders)

## Product Management
Navigate to **Inventory** to manage your products.
- **Add Product**: Click "Add Product" to catalog new pieces.
- **Multiple Images**: You can upload a primary image and several additional images per product.
- **Inventory Tracking**: Stock levels are automatically updated when orders are placed.
- **Low Stock Alerts**: Products with fewer than 10 units are highlighted in amber. Out-of-stock items are highlighted in red.
- **Quick Update**: You can update stock levels directly from the list view by clicking on the stock number.

## Analytics
The **Analytics** page provides strategic insights:
- **Performance Curve**: Revenue trends over the last 7 days.
- **Stock Health**: Breakdown of optimal, low, and exhausted inventory.

## Data Export
You can export your data to CSV format from:
- **Inventory Page**: Export full product catalog.
- **Orders Page**: Export full order history.

## Scalable Backend Setup
The CMS supports two scalable backends. You can choose the one that fits your workflow best:

### Option 1: MongoDB (Recommended)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Add it to your Vercel/Local environment variables:
   - `MONGODB_URI`: your\_mongodb\_connection\_string

### Option 2: Supabase
1. Create a project on [Supabase](https://supabase.com).
2. **Setup Database**: Go to the **SQL Editor** in Supabase and paste the contents of `supabase_schema.sql` (found in your project root). Run it to create the necessary tables.
3. **Setup Storage**: Go to **Storage**, create a new public bucket named `products`.
4. **Environment Variables**: Add the following to your Vercel/Local settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: your\_project\_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your\_anon\_key
   - `SUPABASE_SERVICE_ROLE_KEY`: your\_service\_role\_key (Required for Deletions/Updates)

## API Integration
For technical integrations, the CMS exposes the following REST endpoints (Requires Session Auth):
- `GET /api/cms/products`: Fetch all products.
- `POST /api/cms/products`: Create/Update a product.
- `GET /api/cms/orders`: Fetch all orders.
- `GET /api/cms/analytics`: Fetch current metrics.

## Technical Notes
- **Storage**: Images are stored in Supabase Storage. If Supabase is not connected, it falls back to local storage (development only).
- **Database**: Uses Supabase (PostgreSQL) for persistence. Local JSON fallback is available for development.
- **Deployment**: Integrated with Vercel for instant updates.
