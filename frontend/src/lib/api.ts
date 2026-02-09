const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) return {} as T;
    return response.json();
}

export const api = {
    // Customers
    getCustomers: () => request<any[]>('/api/clients'),
    createCustomer: (data: any) => request<any>('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
    updateCustomer: (id: string, data: any) => request<any>(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Shipments
    getShipments: () => request<any[]>('/api/shipments'),
    cotizarShipment: (data: any) => request<any>('/api/shipments/cotizar', { method: 'POST', body: JSON.stringify(data) }),
    createShipment: (data: any) => request<any>('/api/shipments', { method: 'POST', body: JSON.stringify(data) }),
    updateShipment: (id: string, data: any) => request<any>(`/api/shipments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Routes
    getRoutes: () => request<any[]>('/api/routes'),
    createRoute: (data: any) => request<any>('/api/routes', { method: 'POST', body: JSON.stringify(data) }),
    optimizeRoute: (id: string) => request<any>(`/api/routes/${id}/optimize`, { method: 'POST' }),

    // Zones & Tariffs
    getZones: () => request<any[]>('/api/zones'),
    getTariffs: () => request<any[]>('/api/tariffs'),

    // Payments / Liquidations
    getLiquidations: () => request<any[]>('/api/liquidations'),
    createPayment: (data: any) => request<any>('/api/liquidations', { method: 'POST', body: JSON.stringify(data) }),
};
