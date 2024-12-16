import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]); // Cuvanje trenutno prikazanih troskova
    const [originalExpenses, setOriginalExpenses] = useState([]); // Originalni, nesortirani i nefiltrirani troskovi
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // Podesavanja sortiranja
    const [selectedCategories, setSelectedCategories] = useState([]); // Trenutno izabrane kategorije za filtriranje
    const [priceRange, setPriceRange] = useState([0, 0]); // Trenutni opseg cena za filtriranje
    const [maxPrice, setMaxPrice] = useState(0); // Maksimalna cena za podesavanje slajdera
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Stanje modala
    const [expenseToDelete, setExpenseToDelete] = useState(null); // Trosak za brisanje
    const navigate = useNavigate(); // Navigacija između stranica

    // Dohvatanje troskova sa servera kada se komponenta ucita
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expenses');
                setExpenses(response.data);
                setOriginalExpenses(response.data);
                
                // Izracunavanje maksimalne cene za potrebe slajdera
                const maxExpensePrice = Math.max(...response.data.map(exp => exp.amount));
                setMaxPrice(maxExpensePrice);
                setPriceRange([0, maxExpensePrice]);
            } catch (err) {
                console.error('Error fetching expenses:', err);
            }
        };
        fetchExpenses();
    }, []);

    // Funkcija za brisanje troska sa servera i azuriranje lokalnih podataka
    const deleteExpense = async () => {
        if (!expenseToDelete) return;
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${expenseToDelete}`);
            const updatedExpenses = expenses.filter((expense) => expense._id !== expenseToDelete);
            setExpenses(updatedExpenses);
            setOriginalExpenses(updatedExpenses); // Ažuriramo i originalne podatke
            closeDeleteModal();
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    // Funkcija koja otvara modal za brisanje
    const openDeleteModal = (id) => {
        setExpenseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Funkcija koja zatvara modal za brisanje
    const closeDeleteModal = () => {
        setExpenseToDelete(null);
        setIsDeleteModalOpen(false);
    };

    // Funkcija za uredjivanje troska - navigacija na stranicu za uredjivanje sa podacima troska
    const editExpense = (expense) => {
        navigate('/add-expense', { state: { expense } }); 
    };

    // Funkcija za sortiranje podataka na osnovu kljuca (kolone)
    const handleSort = (key) => {
        let direction = 'ascending';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                direction = 'descending';
            } else if (sortConfig.direction === 'descending') {
                setExpenses(originalExpenses); // Resetovanje na originalni raspored
                setSortConfig({ key: null, direction: null });
                setSelectedCategories([]); // Reset filtera za kategorije
                setPriceRange([0, maxPrice]); // Reset filtera za cenu
                return;
            }
        }

        // Sortiranje troškova prema kljucu i smeru
        const sortedExpenses = [...expenses].sort((a, b) => {
            if (key === 'index') {
                const indexA = expenses.indexOf(a);
                const indexB = expenses.indexOf(b);
                return direction === 'ascending' ? indexA - indexB : indexB - indexA;
            }

            if (key === 'date') {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return direction === 'ascending' ? dateA - dateB : dateB - dateA;
            }

            if (key === 'amount') {
                return direction === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
            }

            return 0;
        });

        setExpenses(sortedExpenses);
        setSortConfig({ key, direction });
    };

    // Funkcija za primenu sortiranja na filtrirane troskove
    const applySorting = (filteredExpenses) => {
        if (!sortConfig.key || !sortConfig.direction) return filteredExpenses; // Ako nema sortiranja, vracamo filtrirane troskove

        const { key, direction } = sortConfig;

        return filteredExpenses.sort((a, b) => {
            if (key === 'index') {
                const indexA = originalExpenses.indexOf(a);
                const indexB = originalExpenses.indexOf(b);
                return direction === 'ascending' ? indexA - indexB : indexB - indexA;
            }

            if (key === 'date') {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return direction === 'ascending' ? dateA - dateB : dateB - dateA;
            }

            if (key === 'amount') {
                return direction === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
            }

            return 0;
        });
    };

    // Funkcija za azuriranje izabranih kategorija i filtriranje
    const handleCategoryChange = (category) => {
        let updatedCategories;
        if (selectedCategories.includes(category)) {
            updatedCategories = selectedCategories.filter((cat) => cat !== category);
        } else {
            updatedCategories = [...selectedCategories, category];
        }
        setSelectedCategories(updatedCategories);
        filterExpenses(updatedCategories, priceRange);
    };

    // Funkcija za azuriranje opsega cena i filtriranje
    const handlePriceChange = (e) => {
        const selectedPrice = parseInt(e.target.value, 10);
        const newPriceRange = [0, selectedPrice];
        setPriceRange(newPriceRange);
        filterExpenses(selectedCategories, newPriceRange);
    };

    // Funkcija za filtriranje troskova po kategorijama i opsegu cena
    const filterExpenses = (categories, priceRange) => {
        let filteredExpenses = originalExpenses;

        if (categories.length > 0) {
            filteredExpenses = filteredExpenses.filter((expense) => categories.includes(expense.category));
        }

        filteredExpenses = filteredExpenses.filter((expense) => expense.amount <= priceRange[1]);

        const sortedAndFilteredExpenses = applySorting(filteredExpenses);
        setExpenses(sortedAndFilteredExpenses);
    };

    // Dohvatanje svih unikatnih kategorija iz troskova
    const uniqueCategories = [...new Set(originalExpenses.map((expense) => expense.category))];

    // Renderovanje komponenti korisnickog interfejsa
    return (
        <div className="all-content">
            <div className="header-with-slider">
                <h1 className='table-title'>List of expenses</h1>
                <div className="slider-container">
                    <label htmlFor="priceRange">Filter by price: </label>
                    <input
                        type="range"
                        id="priceRange"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                    />
                    <span id="money">{` ${priceRange[1]} $`}</span>
                </div>
            </div>
            <div className="table-category-filter">
                <table className='content-table'>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('index')} className="table-hand">
                                No.
                                <span className="sort-arrow">
                                    {sortConfig.key === 'index' ? (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th>Category</th>
                            <th onClick={() => handleSort('amount')} className="table-hand">
                                Price
                                <span className="sort-arrow">
                                    {sortConfig.key === 'amount' ? (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th onClick={() => handleSort('date')} className="table-hand">
                                Date
                                <span className="sort-arrow">
                                    {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th>Description</th>
                            <th>Changes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={expense._id}>
                                <td>{index + 1 + "."}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount + " $"}</td>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.description}</td>
                                <td>
                                    <span className="icon-button" onClick={() => editExpense(expense)}>
                                        <Edit/>
                                    </span>
                                    <span className="icon-button" onClick={() => openDeleteModal(expense._id)}>
                                        <Delete/>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="category-filter">
                    <h3>Filter by category:</h3>
                    {uniqueCategories.map((category) => (
                        <div key={category}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Are you sure you want to delete this expense?</h3>
                            <div className="modal-buttons">
                                <button className="btn btn-delete" onClick={deleteExpense}>
                                    Delete
                                </button>
                                <button className="btn btn-cancel" onClick={closeDeleteModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
