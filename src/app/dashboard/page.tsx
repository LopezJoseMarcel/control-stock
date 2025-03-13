'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        price: '',
        cost: '',
        quantity: '',
    });

    // Obtener productos desde el servidor
    const fetchProducts = async () => {
        const res = await fetch('/api/products', {
            method: 'GET',
            credentials: 'include', // 🔥 Ahora usa cookies para autenticación
        });

        if (res.status === 401) {
            window.location.href = '/login'; // 🔒 Redirigir si no hay token válido
            return;
        }

        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Agregar nuevo producto
    const handleAddProduct = async () => {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // 🔥 Ahora usa cookies para autenticación
            body: JSON.stringify(newProduct),
        });

        const data = await res.json();
        if (data.error) {
            alert(data.error);
        } else {
            fetchProducts();
        }
    };

    // Vender producto
    const handleSellProduct = async (sku: string) => {
        const quantitySold = prompt('Cantidad a vender:');
        if (quantitySold) {
            const res = await fetch('/api/products/sell', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 🔥 Ahora usa cookies para autenticación
                body: JSON.stringify({ sku, quantitySold: parseInt(quantitySold) }),
            });

            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                fetchProducts();
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Control de Inventario</h1>

            {/* Formulario para agregar un producto */}
            <div className="bg-white p-4 rounded shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Agregar Producto</h2>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    className="border p-2 rounded mb-2"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Código SKU"
                    className="border p-2 rounded mb-2"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Precio de venta"
                    className="border p-2 rounded mb-2"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Costo de compra"
                    className="border p-2 rounded mb-2"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Cantidad en stock"
                    className="border p-2 rounded mb-4"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Agregar Producto
                </button>
            </div>

            {/* Listado de productos */}
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <table className="min-w-full bg-white border rounded shadow-md">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">SKU</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Cantidad</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any) => (
                        <tr key={product._id}>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.sku}</td>
                            <td className="border px-4 py-2">{product.price}</td>
                            <td className="border px-4 py-2">{product.quantity}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleSellProduct(product.sku)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    Vender
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
