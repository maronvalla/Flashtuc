const API_BASE = '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMessage = error.message || error.error || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }

    if (response.status === 204) return {} as T;
    return response.json();
}

export const api = {
    // Customers
    getCustomers: () => request<any[]>('/api/clientes'),
    createCustomer: (data: any) => request<any>('/api/clientes', { method: 'POST', body: JSON.stringify(data) }),
    updateCustomer: (id: string, data: any) => request<any>(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Shipments
    getShipments: () => request<any[]>('/api/envios'),
    cotizarShipment: (data: any) => request<any>('/api/envios/cotizar', { method: 'POST', body: JSON.stringify(data) }),
    createShipment: (data: any) => request<any>('/api/envios', { method: 'POST', body: JSON.stringify(data) }),
    updateShipment: (id: string, data: any) => request<any>(`/api/envios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Routes
    getRoutes: () => request<any[]>('/api/rutas'),
    createRoute: (data: any) => request<any>('/api/rutas', { method: 'POST', body: JSON.stringify(data) }),
    optimizeRoute: (id: string) => request<any>(`/api/rutas/${id}/optimize`, { method: 'POST' }),

    // Zones & Tariffs
    getZones: () => request<any[]>('/api/zonas'),
    getTariffs: () => request<any[]>('/api/tarifas'),

    // Payments / Liquidations
    getLiquidations: () => request<any[]>('/api/liquidaciones'),
    createPayment: (data: any) => request<any>('/api/liquidaciones', { method: 'POST', body: JSON.stringify(data) }),
};
