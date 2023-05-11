import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = ({user}) => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        getMeetings();
    }, []);

    const getMeetings = async () => {
        const response = await axios.get('http://localhost:5000/meeting', { withCredentials: true });
        if(response.data) {
            setMeetings(response.data);
        }
    }

    const openModal = () => {
        document.getElementById('modal').showModal();
    };

    const closeModal = () => {
        document.getElementById('modal').close();
    };

    const confirmModal = () => {
        document.getElementById('modal').close();
    };

    const newMeeting = async (e) => {
        e.preventDefault();
        try {
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            let confirmed = false;

            if(user.isAdmin) {
                confirmed = true;
            }

            const response = await axios.post('http://localhost:5000/meeting/add', {
                title: title,
                date: date,
                time: time,
                confirmed: confirmed
            }, { withCredentials: true });
            if(response.status === 200) {
                toast('Meeting created!', {
                    duration: 1500,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    icon: '👏',
                });
                getMeetings();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteMeeting = async (id) => {
        try {
            const response = await axios.delete('http://localhost:5000/meeting/' + id, { withCredentials: true });
            if(response.status === 200) {
                toast('Meeting Canceld!', {
                    duration: 1500,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    icon: '👏',
                });
                getMeetings();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const confirmMeeting = async (id) => {
        try {
            const response = await axios.put('http://localhost:5000/meeting/' + id, {}, { withCredentials: true });
            if(response.status === 200) {
                toast('Meeting Approved!', {
                    duration: 1500,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    icon: '👏',
                });
                getMeetings();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="content-split">
            <div className="intro">
                <h1>Dashboard</h1>
                <p>Welcome, {user.firstname} {user.lastname}!</p>
                <p>You are logged in as {user.isAdmin ? 'an admin' : 'a user'}.</p>
                <button onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('ttl');
                    window.location.replace('http://localhost:3000/');
                }}>Log out</button>
            </div>
            {user.isAdmin ? (
            <div className="meetings">
                <h1>Meetings</h1>
                <div className="meetingList">
                    {meetings.map((meeting) => 
                        meeting.confirmed ? 
                        <div key={meeting._id} className="meeting">
                            <h3>{meeting.title}</h3>
                            <p>{new Date(meeting.date).toDateString()} {meeting.time}</p>
                            <p>Status: <span className="confirmed">Approved</span></p>
                            <button onClick={() => deleteMeeting(meeting._id)} className="secondary smallButton cancelHover">Cancel</button>
                        </div>
                        :
                        <div key={meeting._id} className="meeting">
                            <h3>{meeting.title}</h3>
                            <p>{new Date(meeting.date).toDateString()} {meeting.time}</p>
                            <p>Status: <span className="pending">Pending</span></p>
                            <div className="grid">
                                <button onClick={() => confirmMeeting(meeting._id)} className="secondary confirmHover">Approve</button>
                                <button onClick={() => deleteMeeting(meeting._id)} className="secondary denyHover">Deny</button>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={openModal} className="contrast">Create meeting</button>
            </div>
            ) : (
            <div className="meetings">
                <h1>Meetings</h1>
                <div className="meetingList">
                    {meetings.map((meeting) => 
                        meeting.confirmed ? 
                        <div key={meeting._id} className="meeting">
                            <h3>{meeting.title}</h3>
                            <p>{new Date(meeting.date).toDateString()} {meeting.time}</p>
                            <p>Status: <span className="confirmed">Approved</span></p>
                        </div>
                        :
                        <div key={meeting._id} className="meeting">
                            <h3>{meeting.title}</h3>
                            <p>{new Date(meeting.date).toDateString()} {meeting.time}</p>
                            <p>Status: <span className="pending">Pending</span></p>
                        </div>
                    )}
                </div>
                <button onClick={openModal} className="contrast">Create meeting</button>
            </div>
            )}
            <dialog id="modal">
              <article>
                <a className="close" onClick={closeModal}>
                </a>
                <h3>Create a meeting</h3>
                <p>
                  Send a meeting request.
                </p>
                <form onSubmit={newMeeting}>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" placeholder="Title" required />
                    <div className="grid">
                        <label htmlFor="date">Date
                            <input type="date" id="date" name="date" required />
                        </label>
                        <label htmlFor="time">Time
                            <input type="time" id="time" name="time" required />
                        </label>
                    </div>
                    <button type="button" onClick={closeModal} className="secondary">
                        Cancel
                    </button>
                    <button type="submit" onClick={confirmModal}>
                        Confirm
                    </button>
                </form>
              </article>
            </dialog>
            <Toaster />
        </div>
    );
};

export default Dashboard;