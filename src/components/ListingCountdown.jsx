import { useState, useEffect } from 'react';

const LISTING_DURATION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const ListingCountdown = ({ createdAt }) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!createdAt) return;

        const expires = new Date(createdAt).getTime() + LISTING_DURATION_DAYS * DAY_MS;
        const timer = setInterval(() => {
            const t = Date.now();
            setNow(t);
            if (t >= expires) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [createdAt]);

    if (!createdAt) return null; // Loading or invalid date

    const expires = new Date(createdAt).getTime() + LISTING_DURATION_DAYS * DAY_MS;
    const timeLeft = Math.max(0, expires - now);

    if (timeLeft === 0) {
        return <div className="listing-countdown expired">Expired</div>;
    }

    // Format time
    const days = Math.floor(timeLeft / DAY_MS);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="listing-countdown">
            Deletes in: {days}d {hours.toString().padStart(2, '0')}h {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
        </div>
    );
};

export default ListingCountdown;
