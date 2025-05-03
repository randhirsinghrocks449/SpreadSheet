import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axios";
import { FaEye, FaTrash } from "react-icons/fa";

const Dashboard = () => {
    const [spreadsheets, setSpreadsheets] = useState([]);
    const [newSheetName, setNewSheetName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpreadsheets = async () => {
            try {
                const res = await axiosInstance().get("/spreadsheet/getAllSheets");
                setSpreadsheets(res.data);
            } catch (err) {
                console.error("Failed to fetch spreadsheets", err);
            }
        };
        fetchSpreadsheets();
    }, []);

    const handleCreate = async () => {
        try {
            const res = await axiosInstance().post("/spreadsheet/createSheet", { name: newSheetName || "Untitled" });
            setNewSheetName(""); // Clear input
            navigate(`/spreadsheet?id=${res.data?._id}`);
        } catch (err) {
            console.error("Failed to create spreadsheet", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance().delete(`/spreadsheet/deleteSheet/${id}`);
            setSpreadsheets((prev) => prev.filter((sheet) => sheet._id !== id));
        } catch (err) {
            console.error("Failed to delete spreadsheet", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Spreadsheets</h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center", }}>
                <input
                    type="text"
                    placeholder="Enter spreadsheet name"
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", flex: "1", }}
                />
                <button
                    onClick={handleCreate}
                    style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        width: '300px'
                    }}
                >
                    + Create
                </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {spreadsheets.map((sheet) => (
                    <div
                        key={sheet._id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            width: "200px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <h4 style={{ marginBottom: "12px" }}>{sheet.name}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button
                                onClick={() => navigate(`/spreadsheet?id=${sheet._id}`)}
                                title="View"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <FaEye color="#007bff" />
                            </button>
                            <button
                                onClick={() => handleDelete(sheet._id)}
                                title="Delete"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <FaTrash color="#dc3545" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
