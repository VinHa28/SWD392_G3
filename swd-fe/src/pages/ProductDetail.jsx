import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { Card, Button } from "antd";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProductById(id)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error("Error fetching product:", err));
    }, [id]);

    if (!product) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
            <Card
                title={product.name}
                style={{ width: 600 }}
                cover={
                    product.imageUrl && (
                        <img
                            alt={product.name}
                            src={product.imageUrl}
                            style={{ height: 300, objectFit: "cover" }}
                        />
                    )
                }
            >
                <p><b>Price:</b> {product.price} VND</p>
                <p><b>Stock:</b> {product.stock}</p>
                <p><b>Description:</b> {product.description}</p>
                <p><b>Category:</b> {product.categories?.map(c => c.name).join(", ")}</p>

                <Link to="/products">
                    <Button type="primary" style={{ marginTop: 10 }}>
                        Back to Products
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
