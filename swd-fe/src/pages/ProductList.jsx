import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    useEffect(() => {
        axios.get("http://localhost:9998/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (filterCategory ? p.category === filterCategory : true)
    );

    return (
        <div className="container">
            <h2>All Products</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Cake">Cake</option>
                    <option value="Bread">Bread</option>
                    <option value="Cookie">Cookie</option>
                </select>
            </div>

            <div className="product-grid">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="product-card">
                        <img src={p.image} alt={p.name} />
                        <h4>{p.name}</h4>
                        <p>{p.price} VND</p>
                        <Link to={`/product/${p.id}`}>View Detail</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
