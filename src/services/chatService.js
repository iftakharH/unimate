import { supabase } from '../supabaseClient';

export const chatService = {
    /**
     * Gets an existing chat or creates a new one for the listing/buyer pair.
     */
    async getOrCreateChat(listingId, sellerId, buyerId) {
        if (sellerId === buyerId) throw new Error("You cannot chat with yourself");

        // 1. Try to find existing chat
        const { data: existingChats, error: fetchError } = await supabase
            .from('chats')
            .select('id')
            .eq('listing_id', listingId)
            .eq('buyer_id', buyerId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = JSON object not returned (no rows)
            throw fetchError;
        }

        if (existingChats) {
            return existingChats.id;
        }

        // 2. Create new chat if none exists
        const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert([
                {
                    listing_id: listingId,
                    seller_id: sellerId,
                    buyer_id: buyerId
                }
            ])
            .select()
            .single();

        if (createError) throw createError;
        return newChat.id;
    },

    /**
     * Fetches messages for a specific chat.
     */
    async getMessages(chatId) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Sends a new message.
     */
    async sendMessage(chatId, senderId, content) {
        const { error } = await supabase
            .from('messages')
            .insert([
                {
                    chat_id: chatId,
                    sender_id: senderId,
                    text: content
                }
            ]);

        if (error) throw error;
    },

    /**
     * Creates a new deal.
     */
    async createDeal(chatId, listingId, buyerId, sellerId) {
        const { data, error } = await supabase
            .from('deals')
            .insert([
                {
                    chat_id: chatId,
                    listing_id: listingId,
                    buyer_id: buyerId,
                    seller_id: sellerId,
                    status: 'completed' // or 'pending' if we had a multi-step flow
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Check if deal exists
     */
    async getDeal(chatId) {
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('chat_id', chatId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};
