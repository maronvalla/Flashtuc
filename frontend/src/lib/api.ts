let API_BASE = import.meta.env.VITE_API_BASE || '';
if (API_BASE && !API_BASE.startsWith('http') && API_BASE.includes('.')) {
    API_BASE = `https://${API_BASE}`;
}
console.log('[API Settings] Detected Base URL:', API_BASE || '(Using Local Proxy)');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${path}`;
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        if (isJson) {
            const error = await response.json().catch(() => ({}));
            errorMessage = error.message || error.error || errorMessage;
        } else {
            const text = await response.text();
            if (text.includes('<!doctype html>') || text.includes('<html')) {
                errorMessage = `Error de Configuración: El servidor devolvió HTML en lugar de JSON. Esto suele significar que la URL del backend es incorrecta o falta en Vercel. (URL intentada: ${url})`;
            }
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) return {} as T;

    if (!isJson) {
        const text = await response.text();
        throw new Error(`Respuesta no válida del servidor. Se esperaba JSON pero se recibió: ${text.substring(0, 50)}... (URL: ${url})`);
    }

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
    updateRoute: (id: string, data: any) => request<any>(`/api/rutas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    optimizeRoute: (id: string) => request<any>(`/api/rutas/${id}/optimize`, { method: 'POST' }),

    // Zones & Tariffs
    getZones: () => request<any[]>('/api/zonas'),
    createZone: (data: any) => request<any>('/api/zonas', { method: 'POST', body: JSON.stringify(data) }),
    updateZone: (id: string, data: any) => request<any>(`/api/zonas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteZone: (id: string) => request<any>(`/api/zonas/${id}`, { method: 'DELETE' }),

    getTariffs: () => request<any[]>('/api/tarifas'),
    createTariff: (data: any) => request<any>('/api/tarifas', { method: 'POST', body: JSON.stringify(data) }),
    updateTariff: (id: string, data: any) => request<any>(`/api/tarifas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTariff: (id: string) => request<any>(`/api/tarifas/${id}`, { method: 'DELETE' }),

    // Payments / Liquidations
    getLiquidations: () => request<any[]>('/api/liquidaciones'),
    createPayment: (data: any) => request<any>('/api/liquidaciones', { method: 'POST', body: JSON.stringify(data) }),
};
