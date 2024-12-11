import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelectedFriend(friend)
  {
    setSelectedFriend(curselected => curselected?.id === friend?.id ? null : friend)
    setShowFriendForm(false)
    // setSelectedFriend(friend)
  }
  function handleAddFriends(friend) {
    setFriends(f => [...f, friend]);
    setShowFriendForm(!showFriendForm);
  }

  function handleShowAddFriend() {
    setShowFriendForm((show) => !show);
  }

  function handleSplitBill(value)
  {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance:friend.balance + value} : friend))
    setSelectedFriend(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends}  onSelection={handleSelectedFriend} selectedFriend={selectedFriend}/>

        {showFriendForm && <FormAddFriend onAddFriends={handleAddFriends}/>}
        <Button onClickFn={handleShowAddFriend}>
          {!showFriendForm ? "Add Friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && <FormSplitsBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>
  );
}

function FriendsList({friends,onSelection, selectedFriend}) {
  // const friends = initialFriends;
  console.log('friends')
  console.log(friends)
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          Your {friend.name} owes you £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and your friend are even.</p>}
      <Button onClickFn={()=>onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends}) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if(!name || !imageURL) return
    let id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${imageURL}?=${id}`,
      balance: 0,
    };
    console.log(newFriend)
    onAddFriends(newFriend)

    setName('')
    // setImageURL('')
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClickFn }) {
  return (
    <button onClick={onClickFn} className="button">
      {children}
    </button>
  );
}

function FormSplitsBill({selectedFriend, onSplitBill}) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handleSubmit(e)
  {
    e.preventDefault();
    
    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))}/>

      <label>Your expense</label>
      <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>

      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>Who's paying the bill ?</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
