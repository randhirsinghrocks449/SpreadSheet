import React, { useState, useEffect, useRIdef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../config/axios';
import './spreadsheet.css';
import { socket } from '../../config/soket';
import { useAuth } from '../../context/authContext';

const Spreadsheet = () => {
    const [spreadsheet, setSpreadsheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate(); 

    const queryParams = new URLSearchParams(location.search);
    const spreadsheetId = queryParams.get('id');
    const { user } = useAuth();
   
    useEffect(() => {
        const fetchSpreadsheet = async () => {
            try {
                const response = await axiosInstance().get(`/spreadsheet/getSheetById/${spreadsheetId}`);
                setSpreadsheet(response.data);
            } catch (err) {
                console.error('Error fetching spreadsheet:', err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchSpreadsheet();
    }, [spreadsheetId, navigate]);

    const handleCellEdit = (cellId, newValue) => {
        console.log("Editing cell", cellId, newValue);

        setSpreadsheet(prevSpreadsheet => {
            const updatedSpreadsheet = { ...prevSpreadsheet };
            const cell = updatedSpreadsheet.cells.find(c => c.cellId === cellId);
            if (cell) {
                const oldValue = cell.value;

                if (newValue === '0-0' || newValue === '') {
                    cell.value = '';
                    cell.formula = '';
                } else {
                    if (newValue.startsWith('=')) {
                        const parsedValue = parseFormula(newValue);

                        if (parsedValue !== 'Err') {
                            cell.formula = newValue;
                            cell.value = parsedValue;
                            newValue = parsedValue
                        } else {
                            cell.formula = '';
                            cell.value = newValue;
                        }
                    } else {
                        cell.value = newValue;
                        cell.formula = '';
                    }
                }
                if (!Array.isArray(updatedSpreadsheet.editHistory)) {
                    updatedSpreadsheet.editHistory = [];
                }
                updatedSpreadsheet.editHistory.push({
                    userId: user?._id,
                    cellId,
                    oldValue,
                    newValue,
                    timestamp: new Date().toISOString(),
                });

                console.log("Updated Spreadsheet", updatedSpreadsheet);

                socket.emit('cellUpdated', {
                    userId: user?._id,
                    cellId,
                    oldValue,
                    newValue,
                    spreadsheetId
                });
            }

            return updatedSpreadsheet;
        });
    };

    const parseFormula = (formula) => {
        const regex = /^=([A-Z]+\d+)\s*([+\-*/])\s*([A-Z]+\d+)$/;
        const match = formula.match(regex);
     
        if (match) {
            const [, cell1, operator, cell2] = match;
            const cell1Value = getCellValue(cell1[0], cell1.slice(1));
            const cell2Value = getCellValue(cell2[0], cell2.slice(1));
            if (isNaN(cell1Value) || isNaN(cell2Value)) {
                return 'Err';
            }

            switch (operator) {
                case '+': return cell1Value + cell2Value;
                case '-': return cell1Value - cell2Value;
                case '*': return cell1Value * cell2Value;
                case '/': return cell2Value !== 0 ? cell1Value / cell2Value : 'Err';
                default: return 'Err';
            }
        }
        if (!match) return formula
        return formula.startsWith('=') ? formula.slice(1) : formula;
    };




    const colLetterToIndex = (letters) => {
        return letters.split('').reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0) - 1;
    };
    const getCellValue = (colLetters, rowStr) => {
        const colIndex = colLetterToIndex(colLetters); 
        const rowIndex = parseInt(rowStr, 10) - 1;
        const cellId = `${rowIndex}-${colIndex}`;
        const cell = spreadsheet.cells.find(cell => cell.cellId === cellId);
        return cell ? parseFloat(cell.value) : 0;
    };

    useEffect(() => {
        const handleCellUpdate = (data) => {
            if (data.spreadsheetId !== spreadsheetId) return;
            setSpreadsheet(prev => {
                const updatedCells = prev.cells.map(cell => {
                    return cell.cellId === data.cellId
                        ? {
                            ...cell,
                            value: data.newValue,
                            formula: data.formula || '',
                        }
                        : cell
                }
                );
                return { ...prev, cells: updatedCells };
            });
        };

        socket.on('cellUpdated', handleCellUpdate);

        return () => {
            socket.off('cellUpdated', handleCellUpdate);
        };
    }, [spreadsheetId]);

    const renderSpreadsheet = () => {
        if (!spreadsheet || !spreadsheet.cells) return null;

        const columns = 10;
        const rowCount = Math.ceil(spreadsheet.cells.length / columns);
        const rows = [];
        const columnHeaders = Array.from({ length: columns }, (_, i) => (
            <th key={i} className="column-header">{String.fromCharCode(65 + i)}</th>
        ));
        rows.push(<tr key="header"><th></th>{columnHeaders}</tr>);
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const rowCells = [];
            for (let colIndex = 0; colIndex < columns; colIndex++) {
                const cellIndex = rowIndex * columns + colIndex;
                const cell = spreadsheet.cells[cellIndex];

                if (!cell) continue;

                const cellValue = cell.formulxa
                    ? parseFormula(cell.formula)
                    : cell.value ?? '';

                rowCells.push(
                    <td key={cell.cellId}>
                        <input
                            type="text"
                            value={cellValue}
                            onChange={(e) => handleCellEdit(cell.cellId, e.target.value)}
                            className="cell-input"
                        />
                    </td>
                );
            }
            rows.push(
                <tr key={rowIndex}>
                    <th className="row-header">{rowIndex + 1}</th>
                    {rowCells}
                </tr>
            );
        }
        return rows;
    };

    return (
        <div className="spreadsheet-container">
            {loading ? (
                <p>Loading spreadsheet...</p>
            ) : spreadsheet ? (
                <div>
                    <h1>{spreadsheet.name}</h1>
                    <table>
                        <tbody>{renderSpreadsheet()}</tbody>
                    </table>
                </div>
            ) : (
                <p>Spreadsheet not found</p>
            )}
        </div>
    );
};

export default Spreadsheet;
