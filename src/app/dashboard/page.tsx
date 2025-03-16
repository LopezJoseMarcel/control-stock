"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  laboratorio: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogType, setDialogType] = useState<"sell" | "stockUpdate" | null>(
    null
  );
  const [selectedSku, setSelectedSku] = useState<string>("");
  const [dialogData, setDialogData] = useState({ quantity: "", reason: "",tipo:"efectivo",cost: 1 });

  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    cost: "",
    quantity: "",
    laboratorio: "",
  });

  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?search=${searchTerm}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleDialogSubmit = async () => {
    const endpoint =
      dialogType === "sell"
        ? "/api/products/sell"
        : "/api/products/stockUpdate";
    const body = {
      sku: selectedSku,
      quantity: parseInt(dialogData.quantity),
      reason: dialogData.reason,
      cost: dialogData.cost, 
      tipo: dialogData.tipo,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchProducts();
      setDialogType(null);
      setDialogData({ quantity: "", reason: "", tipo:"efectivo", cost: 0 });
    }
  };

  const handleAddProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchProducts();
      setAddProductDialogOpen(false);
      setNewProduct({
        name: "",
        sku: "",
        price: "",
        cost: "",
        quantity: "",
        laboratorio: "",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;

    const res = await fetch(`/api/products/${editProduct._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editProduct),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchProducts();
      setEditProductDialogOpen(false);
      setEditProduct(null);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setEditProductDialogOpen(true);
  };

  const openDialog = (sku: string, type: "sell" | "stockUpdate") => {
    setSelectedSku(sku);
    setDialogType(type);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Control de Inventario</h1>

      <input
        type="text"
        placeholder="Buscar producto por nombre"
        className="border p-2 rounded mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white p-2 rounded mb-4"
        onClick={() => setAddProductDialogOpen(true)}
      >
        Agregar Producto
      </button>

      <h2 className="text-xl font-semibold mb-4">Productos</h2>
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Laboratorio</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Costo</th>
            <th className="border px-4 py-2">Precio</th>
            <th className="border px-4 py-2">Cantidad</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.laboratorio}</td>
              <td className="border px-4 py-2">{product.sku}</td>
              <td className="border px-4 py-2">{product.cost}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openDialog(product.sku, "sell")}
                  className="bg-red-500 text-white p-2 rounded mr-2"
                >
                  Vender
                </button>
                <button
                  onClick={() => openDialog(product.sku, "stockUpdate")}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Actualizar Stock
                </button>
                <button
                  onClick={() => openEditDialog(product)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Diálogo de Vender/Actualizar Stock */}
      <Dialog open={dialogType !== null} onClose={() => setDialogType(null)}>
        <DialogTitle>
          {dialogType === "sell" ? "Vender Producto" : "Actualizar Stock"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            value={dialogData.quantity}
            onChange={(e) =>
              setDialogData({ ...dialogData, quantity: e.target.value })
            }
            margin="normal"
            required
          />
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Transaccion
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={"efectivo"}
              onChange={(e) =>
                setDialogData({ ...dialogData, tipo: e.target.value })
              }
            >
              <FormControlLabel
                value="efectivo"
                control={<Radio />}
                label="Efectivo"
              />
              <FormControlLabel
                value="transferencia"
                control={<Radio />}
                label="Transferencia"
              />
            </RadioGroup>
          </FormControl>
          {dialogType === "stockUpdate" && (
            <>
            <TextField
              label="Razón"
              fullWidth
              value={dialogData.reason}
              onChange={(e) =>
                setDialogData({ ...dialogData, reason: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
               type="text"
              label="Costo"
              fullWidth
              value={dialogData.cost}
              onChange={(e) =>
                setDialogData({ ...dialogData, cost: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0 })
              }
              margin="normal"
              required
            />
          </>
            
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDialogSubmit}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Diálogo para editar producto */}
      <Dialog
        open={editProductDialogOpen}
        onClose={() => setEditProductDialogOpen(false)}
      >
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {editProduct &&
            Object.entries(editProduct).map(([key, value]) => {
              const keysToEdit = [
                "name",
                "sku",
                "price",
                "cost",
                "laboratorio",
              ];
              if (keysToEdit.includes(key)) {
                return (
                  <TextField
                    key={key}
                    label={key[0].toUpperCase() + key.slice(1)}
                    fullWidth
                    value={value}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, [key]: e.target.value })
                    }
                    margin="normal"
                    required
                  />
                );
              }
            })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditProductDialogOpen(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEditProduct}
            color="primary"
            variant="contained"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      {/* Diálogo de pantalla completa para agregar producto */}
      <Dialog
        open={addProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
        fullScreen
      >
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          {Object.entries(newProduct).map(([key, value]) => (
            <TextField
              key={key}
              label={key[0].toUpperCase() + key.slice(1)}
              fullWidth
              value={value}
              onChange={(e) =>
                setNewProduct({ ...newProduct, [key]: e.target.value })
              }
              margin="normal"
              required
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddProductDialogOpen(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddProduct}
            color="primary"
            variant="contained"
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
