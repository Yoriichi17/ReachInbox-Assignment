import React, { useEffect, useState, useCallback } from 'react';
import { fetchEmails, deleteEmail, sendReply ,resetEmails } from '../api/onebox';
import { FaTrash, FaReply, FaBolt, FaEye, FaFont, FaLink, FaPhotoVideo, FaSmile } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,  faInbox, faUser,faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import '../styles/OneBoxScreen.css';
import LogoL from '../images/LogoL.png';
import LogoD from '../images/LogoD.png';
import BackL from '../images/BackL.png';
import BackD from '../images/BackD.png';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';
const OneBoxScreen = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [replyDetails, setReplyDetails] = useState({
        to: '',
        from: '',
        subject: '',
        body: '',
    });
    const [isInboxVisible, setIsInboxVisible] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [activities , setActivities] = useState([]);
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    const navigate = useNavigate();
    const handleLogout = async () => {
        setShowAlert(true); 
    };

    const confirmLogout = async () => {
        try {
            console.log('Attempting to reset emails...');
            await resetEmails();  
            console.log('Emails reset successfully.');
            
            localStorage.removeItem('authToken');  
            console.log('Auth token removed.');

            navigate('/');  
            console.log('Navigated to login page.');
        } catch (error) {
            console.error('Failed to reset emails:', error.message);
            alert('An error occurred while logging out. Please try again.');
        } finally {
            setShowAlert(false); 
        }
    };

    const cancelLogout = () => {
        setShowAlert(false); 
    };
    
    
    
    const handleInboxToggle = () => {
        setIsInboxVisible(prevState => !prevState);
    };
    
    useEffect(() => {
        fetchEmails()
            .then(response => {
                setEmails(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching emails:', error);
            });
    }, []);

   

    const handleDeleteClick = useCallback((event, threadId) => {
        event?.stopPropagation();
        setEmailToDelete(threadId); 
        setShowDeleteAlert(true);   
    }, []);

    const confirmDelete = () => {
        if (emailToDelete) {
            deleteEmail(emailToDelete)
                .then(() => {
                    setEmails(emails.filter(email => email.threadId !== emailToDelete));
                    if (selectedEmail && selectedEmail.threadId === emailToDelete) {
                        setSelectedEmail(null);
                    }
                })
                .catch(error => {
                    console.error('Error deleting email:', error);
                })
                .finally(() => {
                    setShowDeleteAlert(false); 
                    setEmailToDelete(null);    
                });
        }
    };

    const cancelDelete = () => {
        setShowDeleteAlert(false); 
        setEmailToDelete(null);    
    };

    const handleReplyClick = useCallback((email) => {
        setReplyDetails({
            to: email.fromEmail,
            from: 'mitrajit2022@gmail.com',
            subject: `Re: ${email.subject}`,
            body: '',
        });
        setIsReplyModalOpen(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isReplyModalOpen && selectedEmail) {
                if (event.key === 'd') {
                    handleDeleteClick(null, selectedEmail.threadId);
                } else if (event.key === 'r') {
                    handleReplyClick(selectedEmail);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedEmail, handleDeleteClick, handleReplyClick, isReplyModalOpen]);

    const handleEmailClick = (email) => {
        setSelectedEmail(prev => (prev && prev.id === email.id ? null : email));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReplyDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSendReply = () => {
        if (!selectedEmail) {
            alert('No email selected for reply');
            return;
        }

        const { to, from, subject, body } = replyDetails;
        const replyData = {
            toName: selectedEmail.fromName || 'Unknown',
            to,
            from,
            fromName: 'Mitrajit',
            subject,
            body,
            references: [selectedEmail.messageId || ''],
            inReplyTo: selectedEmail.messageId || '',
        };

        sendReply(selectedEmail.threadId, replyData)
            .then(response => {
                setEmails(prevEmails => prevEmails.map(email =>
                    email.threadId === selectedEmail.threadId
                        ? { ...email, replies: [...(email.replies || []), replyData] }
                        : email
                ));
                setIsReplyModalOpen(false);
                setReplyDetails({
                    to: '',
                    from: '',
                    subject: '',
                    body: '',
                });
            })
            .catch(error => {
                console.error('Error sending reply:', error);
            });
    };
    
    const getSubjectPreview = (subject) => {
        const words = subject.split(' ').slice(0, 5).join(' ');
        return words;
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    
    useEffect(() => {
        setActivities([
            { id: 1, action:'Logged in', timestamp: new Date().toLocaleString() },
        ]);
    }, []);
    return (
        
        <div className={isDarkMode ? "d-onebox-container" : "onebox-container"}>
            {/* Topbar */}
            <div className={isDarkMode ? "d-top-navbar" : "top-navbar"}>
                <h2>OneBox</h2>
                <button style={isDarkMode ? {marginLeft : '1150px' , cursor : 'pointer' , backgroundColor : 'black' , border : 'none' , fontSize : 'medium' , color : 'white' } : {marginLeft : '1150px' , cursor : 'pointer' , backgroundColor : 'white' , border : 'none' , fontSize : 'medium'}} onClick={toggleDarkMode} className="dark-light-toggle">
                    <FontAwesomeIcon  icon={isDarkMode ? faSun : faMoon} />
                </button>
                <h5 style={{marginLeft : '20px'}}>Anirudh's Workspace</h5>
            </div>

            {/* Sidebar */}
            <div className={isDarkMode ? "d-left-sidebar" : "left-sidebar"}>
               
            <div className={isDarkMode ? "d-sidebar-icon1" : "sidebar-icon1"}>
            <img src={isDarkMode? LogoD :LogoL} alt="Logo" width={40}/>
            </div>
               
            <div className={isDarkMode ? "d-sidebar-icon2" : "sidebar-icon2"}>
                <FontAwesomeIcon icon={faHome} />
            </div>
            
            
            <div className={isDarkMode ? "d-sidebar-icon3" : "sidebar-icon3"}  onClick={handleInboxToggle}>
                <FontAwesomeIcon icon={faInbox} />
            </div>
            
            <div className={isDarkMode ? "d-sidebar-icon4" : "sidebar-icon4"}>
                <FontAwesomeIcon icon={faUser} onClick={handleLogout} />
            </div>

            {showAlert && (
                <CustomAlert 
                    message="Are you sure you want to log out?"
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
                
            </div>

           {/* Email List */}
            <div className={isDarkMode ? "d-main-content" : "main-content"}>
            {isInboxVisible && (
    <div className={isDarkMode ? "d-email-list" : "email-list"}>
        <h2 style={{marginLeft : 100}}>Inbox</h2>
        <ul>
            {emails.map((email) => (
                <li
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className={selectedEmail?.id === email.id ? 'selected' : ''}
                >
                    <div cclassName={isDarkMode ? "d-email-info" : "email-info"}>
                        <div style={{display : 'flex' , position : 'relative'}}>
                        <strong>{email.fromEmail}</strong>
                        <p style={{position : 'absolute' , left : 210 , top: -12 }}>{formatDate(email.sentAt)}</p>
                        </div>
                        
                        <p>{getSubjectPreview(email.subject)}</p>
                    </div>
                    </li>
                    ))}
                    </ul>
                    </div>
                    )}
                {/* Email Details */}
                {isInboxVisible ? (
                <div className={isDarkMode ? "d-email-details" : "email-details"}>
                    {selectedEmail ? (
                        <>  
                        <div className={isDarkMode ? "d-mail-structure" : "mail-structure"}>
                            <div style={{display : 'flex' , position : 'relative'}}>
                            <h4>{selectedEmail.subject}</h4>
                            <p style={{position : 'absolute' , left : 565, top:5}}>{new Date(selectedEmail.sentAt).toLocaleString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })}</p>

                            </div>
                        
                            <p>From :{selectedEmail.fromEmail}</p>
                            <div style={{display : 'flex' , flexDirection : 'row' , gap : 20}}>
                            <p>To : {selectedEmail.toEmail}</p>
                            <p>CC : {selectedEmail.cc.join(', ') || 'None'}</p>
                            </div>
                            
                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                            <div className={ isDarkMode ? "d-email-replies": "email-replies"}>
                                {(selectedEmail.replies || []).map((reply, index) => (
                                    <div key={index} className={ isDarkMode ? "d-email-reply": "email-reply"}>
                                        <p><strong>From : </strong> {reply.fromName} &lt;{reply.from}&gt;</p>
                                        <p><strong>Subject : </strong> {reply.subject}</p>
                                        <div dangerouslySetInnerHTML={{ __html: reply.body }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div cclassName={isDarkMode ? "d-email-actions" : "email-actions"}>
                                <button className={isDarkMode?"d-reply-button":"reply-button"} onClick={() => handleReplyClick(selectedEmail)}>
                                    <FaReply style={{color : 'white', fontSize : 20}}/> Reply
                                </button>
                                <div>
            <button 
                className={isDarkMode ? "d-delete-button" : "delete-button"} 
                onClick={(e) => handleDeleteClick(e, selectedEmail?.threadId)}
            >
                <FaTrash style={{ color: 'white' }} /> Delete
            </button>

            {showDeleteAlert && (
                <CustomAlert
                    message="Are you sure you want to delete this email?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    isDarkMode={isDarkMode} 
                />
            )}
        </div>
                            </div>
                        </>
                    ) : (
                        <div style={isDarkMode ? {alignSelf : 'center' , marginTop : 95,marginLeft :20} : {alignSelf : 'center' , marginTop : 40}}>
                           <img src={isDarkMode ? BackD : BackL} alt='BackL' width={700} /> 
                        </div>
                    )}
                </div>
                ) : (
                    <div className={isDarkMode ? "d-no-email-selected" : "no-email-selected"}>
                         <img src={isDarkMode ? BackD : BackL} alt='BackL'/>
                    </div>
                )}
                {/* Lead Details and activities */}
                <div className={ isDarkMode?"d-lead-details":"lead-details"}>
                
                <div id={isDarkMode ? 'd-lead' : 'lead'}><h3>Lead Details</h3></div>
                <div  className={isDarkMode ? "d-details ":"details"}>
                <p>Name:<strong>Anirudh</strong></p>
                <p>Contact No:<strong>+91-9731937314</strong> </p>
                <p>Email ID:<strong>nayakanirudhp@gmail.com</strong> </p>
                <p>Linkedin:<strong><a href="https://www.linkedin.com/in/anirudhpnayak/">linkedin.com/in/timvadde/</a></strong> </p>
                <p>Company Name:<strong>Reachinbox</strong> </p>
                </div>
                <div id={isDarkMode ? 'd-lead1' : 'lead1'}><h3>Activities</h3></div>   
                <div className={isDarkMode ? "d-details1 ":"details1"}>
                <ul style={{marginLeft : -30}}>
                            {activities.map(activity => (
                                <li key={activity.id}>
                                    <p><strong>{activity.action}</strong> - <span>{activity.timestamp}</span></p>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
            </div>

            {/* Reply Modal */}
            {isReplyModalOpen && (
                <div className={isDarkMode ? "d-reply-modal" : "reply-modal"}>
                    <div className={isDarkMode?"d-reply-modal-content":"reply-modal-content"}>
                       
                        <div className={isDarkMode?"d-close-button":"close-button"} onClick={() => setIsReplyModalOpen(false)}>
                            &times;
                        </div>
                        <h3>Reply to {replyDetails.to}</h3>
                        <form>
                            <div className={isDarkMode ? "d-form-group" :"form-group"}>
                                <label>To:</label>
                                <input
                                    type="email"
                                    name="to"
                                    value={replyDetails.to}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className={isDarkMode ? "d-form-group" :"form-group"}>
                                <label>From:</label>
                                <input
                                    type="email"
                                    name="from"
                                    value={replyDetails.from}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className={isDarkMode ? "d-form-group" :"form-group"}>
                                <label>Subject:</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={replyDetails.subject}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={isDarkMode ? "d-form-group" :"form-group"}>
                               
                                <textarea
                                    name="body"
                                    value={replyDetails.body}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={isDarkMode?"d-editor-actions":"editor-actions"}>
                            <button type="button" onClick={handleSendReply} className='replyy-btn'>
                                Send
                                </button>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaBolt />
                                </button>
                                <p>Variables</p>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaEye />
                                </button>
                                <p style={{fontSize : 'smaller'}}>Preview Email</p>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaFont />
                                </button>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaLink />
                                </button>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaPhotoVideo />
                                </button>
                                <button type="button" className={isDarkMode?"d-editor-icon  variable-button":"editor-icon  variable-button"}>
                                    <FaSmile />
                                </button>
                               
                            </div>
                            
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OneBoxScreen;
