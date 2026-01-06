import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        try {
            // Fetch chats where user is buyer OR seller
            const { data: chats, error } = await supabase
                .from('chats')
                .select(`
                    id,
                    created_at,
                    buyer_id,
                    seller_id,
                    listing:listings (
                        title,
                        image_url,
                        price
                    )
                `)
                .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // For each chat, fetch the last message
            const conversationsWithMessages = await Promise.all(
                chats.map(async (chat) => {
                    const { data: lastMessage } = await supabase
                        .from('messages')
                        .select('text, created_at, sender_id')
                        .eq('chat_id', chat.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    // Determine the conversation partner
                    const partnerId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;

                    return {
                        ...chat,
                        lastMessage,
                        partnerId,
                        isUnread: lastMessage && lastMessage.sender_id !== user.id
                    };
                })
            );

            setConversations(conversationsWithMessages);
        } catch (error) {
            console.error('Error fetching conversations:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading messages...</div>;

    return (
        <div className="messages-container">
            <h1 className="messages-header">Messages</h1>

            {conversations.length === 0 ? (
                <div className="empty-state">
                    <p>No messages yet.</p>
                    <p className="empty-hint">Start browsing the marketplace to connect with sellers!</p>
                    <button onClick={() => navigate('/marketplace')}>Browse Marketplace</button>
                </div>
            ) : (
                <div className="conversations-list">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`conversation-card ${conv.isUnread ? 'unread' : ''}`}
                            onClick={() => navigate(`/chat/${conv.id}`)}
                        >
                            <div className="conv-image">
                                {conv.listing && (
                                    <img src={conv.listing.image_url} alt={conv.listing.title} />
                                )}
                            </div>
                            <div className="conv-content">
                                <div className="conv-header">
                                    <h3>{conv.listing ? conv.listing.title : 'Unknown Item'}</h3>
                                    {conv.isUnread && <span className="unread-badge"></span>}
                                </div>
                                <p className="conv-preview">
                                    {conv.lastMessage ? conv.lastMessage.text : 'No messages yet'}
                                </p>
                                <span className="conv-time">
                                    {conv.lastMessage
                                        ? new Date(conv.lastMessage.created_at).toLocaleDateString()
                                        : new Date(conv.created_at).toLocaleDateString()
                                    }
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
