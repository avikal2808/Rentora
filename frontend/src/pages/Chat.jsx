import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Active chat state
  const { userId: initialOtherUserId, userName: initialOtherUserName } = location.state || {};
  const [activeChatId, setActiveChatId] = useState(initialOtherUserId);
  const [activeChatName, setActiveChatName] = useState(initialOtherUserName);

  // Conversations sidebar state
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Current chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch recent conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/chat/conversations');
        setConversations(response.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, [user]);

  // Handle active chat scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load history and connect WebSocket when active chat changes
  useEffect(() => {
    if (!activeChatId) return;

    // Load History
    const fetchHistory = async () => {
      setLoadingMessages(true);
      try {
        const response = await api.get(`/chat/history?otherUserId=${activeChatId}&size=50`);
        const hist = response.data.content || response.data;
        // Sort chronologically
        const sorted = [...hist].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to load chat history.');
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchHistory();
    
    // Connect WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        // console.log(str);
      },
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      onConnect: () => {
        client.subscribe('/user/queue/messages', (msg) => {
          if (msg.body) {
            const body = JSON.parse(msg.body);
            // Update messages if it belongs to the current active chat
            if (body.senderId === activeChatId || body.receiverId === activeChatId) {
                setMessages(prev => {
                  if (prev.find(m => m.id === body.id)) return prev;
                  return [...prev, body];
                });
            }
            // Also refresh conversations list to update latest snippet/timestamp
            refreshConversations();
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, [activeChatId]);

  const refreshConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (err) { }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !stompClient || !stompClient.connected) return;

    const payload = {
      receiverId: activeChatId,
      content: inputMessage.trim(),
      itemId: location.state?.itemId || null
    };

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload)
    });
    
    setInputMessage('');
    refreshConversations();
  };

  const handleSelectConversation = (otherUser) => {
    if (activeChatId === otherUser.id) return; // Ignore clicking the already active chat
    setActiveChatId(otherUser.id);
    setActiveChatName(otherUser.name || otherUser.email);
    setMessages([]); // Instant UI feedback!
    // Clear URL state so refresh doesn't jump back
    navigate('/chat', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-5 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary-500" /> Messages
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="text-center p-8 text-gray-400 text-sm">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-gray-400 flex flex-col items-center">
               <MessageSquare size={32} className="mb-2 opacity-20" />
               <p className="text-sm">No conversations yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {conversations.map(conv => {
                // Find out who the other person is
                const isAmISender = String(conv.senderId) === String(user?.id) || conv.senderEmail === user?.email;
                const otherId = isAmISender ? conv.receiverId : conv.senderId;
                const otherName = isAmISender ? (conv.receiverName || conv.receiverEmail) : (conv.senderName || conv.senderEmail); 
                
                return (
                  <button 
                    key={otherId}
                    onClick={() => handleSelectConversation({ id: otherId, name: otherName })}
                    className={`w-full text-left p-4 border-b border-gray-50 flex items-center gap-3 transition-colors ${activeChatId === otherId ? 'bg-primary-50 border-l-4 border-l-primary-500' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
                  >
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {otherName ? otherName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-gray-900 truncate pr-2">{otherName || 'User'}</h4>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(conv.timestamp).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.content}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!activeChatId ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <UserIcon size={64} className="text-gray-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Select a Conversation</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-sm">Choose a user from the sidebar to view your message history and continue chatting.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-400 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  {activeChatName ? activeChatName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeChatName || 'User'}</h3>
                  <p className="text-xs text-green-500 font-medium">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50/30">
              {loadingMessages && <div className="text-center text-gray-400 py-4">Loading history...</div>}
              {error && <div className="text-center text-red-500 py-4">{error}</div>}
              
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id || msg.senderEmail === user?.email;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${isMe ? 'bg-primary-600 text-white rounded-tr-sm shadow-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[10px] mt-1.5 block ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4 pb-6">
              <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                <input 
                  type="text" 
                  className="flex-grow bg-gray-50 border border-gray-200 text-gray-900 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-primary-600 text-white p-3.5 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/30"
                >
                  <Send size={22} className="translate-x-[-1px] translate-y-[1px]" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
