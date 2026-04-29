import { getOrders } from '@/lib/db';
import AdminOrdersClient from './AdminOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return <AdminOrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />;
}
