import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/sl-backend/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios
      .get(URL)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        alert(error.response ? error.response.data.error : error);
      });
  }, []);

  function add(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: item, amount: amount });
    axios
      .post(URL + 'add.php', json, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setItems((items) => [...items, response.data]);
        setItem('');
        setAmount('');
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }

  function remove(id) {
    const json = JSON.stringify({ id: id });
    axios
      .post(URL + 'delete.php', json, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      })
      .catch((error) => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className="content">
      <h1>Shopping list</h1>
      <form onSubmit={add}>
        <label>New item</label>
        <input type="text" placeholder="type description" value={item} onChange={(e) => setItem(e.target.value)} />
        <input type="number" placeholder="type amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button>Add</button>
      </form>

      <table>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.amount}</td>
              <td>
                <a href="#" onClick={() => remove(item.id)}>
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
