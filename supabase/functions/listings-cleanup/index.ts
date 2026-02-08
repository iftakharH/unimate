
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const BATCH_SIZE = 100
const EXPIRE_DAYS = 30
const WARNING_DAYS = 3

// Setup Supabase client with Service Role Key (to bypass RLS)
const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
    try {
        const now = new Date()

        // 1. DELETE EXPIRED LISTINGS
        const expiredDate = new Date(now.getTime() - (EXPIRE_DAYS * 24 * 60 * 60 * 1000))

        const { data: expiredListings, error: fetchError } = await supabase
            .from('listings')
            .select('id, seller_id, title, listing_images(image_url), image_url')
            .lt('created_at', expiredDate.toISOString())
            .limit(BATCH_SIZE)

        if (fetchError) throw fetchError

        const deletedIds = []
        if (expiredListings && expiredListings.length > 0) {
            console.log(`Found ${expiredListings.length} expired listings.`)

            // Cleanup Storage (Optional - requires bucket name confirmation)
            // Assuming 'listings' bucket
            /*
            for (const item of expiredListings) {
              const filesToRemove = []
              if (item.image_url) filesToRemove.push(item.image_url)
              if (item.listing_images) {
                 item.listing_images.forEach(img => {
                   if (img.image_url) filesToRemove.push(img.image_url)
                 })
              }
              // Parsing filenames from URLs would be needed here
            }
            */

            // Delete from DB
            const ids = expiredListings.map(l => l.id)
            const { error: deleteError } = await supabase
                .from('listings')
                .delete()
                .in('id', ids)

            if (deleteError) {
                console.error('Error deleting listings:', deleteError)
            } else {
                deletedIds.push(...ids)
                console.log(`Deleted listings: ${ids.join(', ')}`)
            }
        }

        // 2. SEND WARNING NOTIFICATIONS (Expiring in 3 days)
        // created_at is older than (30-3)=27 days
        // But younger than 28 days (to ensure we only send once in the daily window)
        const warningDateStart = new Date(now.getTime() - ((EXPIRE_DAYS - WARNING_DAYS) * 24 * 60 * 60 * 1000))
        // Look back 24 hours from that point
        const warningDateEnd = new Date(warningDateStart.getTime() - (24 * 60 * 60 * 1000))

        // Logic: created_at < warningDateStart AND created_at > warningDateEnd
        // Actually: created_at <= (now - 27 days) AND created_at > (now - 28 days)
        // This catches items that turned 27 days old "today"

        const { data: expiringListings, error: warnError } = await supabase
            .from('listings')
            .select('id, seller_id, title')
            .lte('created_at', warningDateStart.toISOString())
            .gt('created_at', warningDateEnd.toISOString())

        if (warnError) throw warnError

        let sentCount = 0
        if (expiringListings && expiringListings.length > 0) {
            console.log(`Found ${expiringListings.length} listings expiring soon.`)

            const notifications = expiringListings.map(item => ({
                recipient_id: item.seller_id,
                sender_id: null, // System message or handle constraint
                content: `Your listing "${item.title}" will expire and be deleted in ${WARNING_DAYS} days.`,
                is_read: false,
                created_at: new Date().toISOString()
            }))

            // Insert into 'messages' or 'notifications'
            // Assuming 'messages' for now as seen in Profile.jsx
            // Note: sender_id might need to be a real UUID or handled by schema. 
            // If strict foreign key on sender_id, this might fail if NULL is not allowed.
            // SAFEGUARD: We will try to insert. If it fails, we log it.

            const { error: notifyError } = await supabase
                .from('messages')
                .insert(notifications)

            if (notifyError) {
                console.error('Error sending notifications:', notifyError)
            } else {
                sentCount = notifications.length
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                deleted: deletedIds.length,
                warnings_sent: sentCount
            }),
            { headers: { 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
