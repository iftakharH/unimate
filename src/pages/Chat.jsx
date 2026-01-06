import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import '../styles/Chat.css';

const Chat = () => {
    const { chatId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [deal, setDeal] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user) return;

        // 1. Fetch Chat Info
        const fetchChatInfo = async () => {
            const { data: chat, error } = await supabase
                .from('chats')
                .select(`
          *,
          listings (id, title, price, image_url)
        `)
                .eq('id', chatId)
                .single();

            if (error) {
                console.error('Error fetching chat:', error);
                navigate('/marketplace');
                return;
            }

            setChatInfo(chat);
            setLoading(false);
        };

        // 2. Fetch Deal Info
        const loadDeal = async () => {
            try {
                const dealData = await chatService.getDeal(chatId);
                setDeal(dealData);
            } catch (e) {
                // Ignore if no deal found
            }
        };

        // 3. Fetch Initial Messages
        const loadMessages = async () => {
            try {
                const msgs = await chatService.getMessages(chatId);
                setMessages(msgs);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        fetchChatInfo();
        loadDeal();
        loadMessages();

        // 4. Subscribe to Realtime Messages
        const channel = supabase
            .channel(`chat:${chatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `chat_id=eq.${chatId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, user, navigate]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await chatService.sendMessage(chatId, user.id, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleMarkSold = async () => {
        if (!chatInfo || !user) return;
        if (!confirm('Are you sure you want to mark this item as SOLD to this buyer?')) return;

        try {
            const newDeal = await chatService.createDeal(
                chatId,
                chatInfo.listings.id,
                chatInfo.buyer_id,
                chatInfo.seller_id
            );
            setDeal(newDeal);
            // System message
            await chatService.sendMessage(chatId, user.id, "🎉 I have marked this item as SOLD! Transaction complete.");
        } catch (error) {
            console.error('Error marking deal:', error);
            alert('Failed to mark deal');
        }
    };

    if (loading) return <div className="chat-loading">Loading conversation...</div>;

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-listing-info">
                    {chatInfo?.listings?.image_url && (
                        <img src={chatInfo.listings.image_url} alt="Item" className="chat-item-thumb" />
                    )}
                    <div>
                        <h3 className="chat-item-title">{chatInfo?.listings?.title || 'Item Chat'}</h3>
                        <span className="chat-item-price">${chatInfo?.listings?.price}</span>
                    </div>
                </div>

                {/* Deal Action Button */}
                {deal ? (
                    <div className="deal-status">✅ Sold</div>
                ) : (
                    user && chatInfo && user.id === chatInfo.seller_id && (
                        <button onClick={handleMarkSold} className="btn-mark-sold">
                            Mark as Sold
                        </button>
                    )
                )}
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
                {messages.map((msg) => {
                    const isOwn = msg.sender_id === user.id;
                    return (
                        <div key={msg.id} className={`message-row ${isOwn ? 'message-own' : 'message-other'}`}>
                            <div className="message-bubble">
                                {msg.text}
                                <div className="message-time">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="chat-input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="btn-send">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
